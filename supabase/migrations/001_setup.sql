-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla de ubicaciones
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    embedding vector(1536),
    coordinates geography(POINT, 4326),
    category TEXT DEFAULT 'general',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice GiST para búsquedas geoespaciales
CREATE INDEX IF NOT EXISTS locations_geo_idx ON locations USING GIST (coordinates);

-- Índice para búsqueda vectorial (IVFFlat)
CREATE INDEX IF NOT EXISTS locations_embedding_idx ON locations USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Función para buscar lugares cercanos
CREATE OR REPLACE FUNCTION find_locations_nearby(
    lat FLOAT,
    lng FLOAT,
    radius_km FLOAT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    category TEXT,
    coordinates geography,
    distance_meters FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.name,
        l.description,
        l.category,
        l.coordinates,
        ST_Distance(l.coordinates, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) AS distance_meters
    FROM locations l
    WHERE ST_DWithin(
        l.coordinates,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radius_km * 1000
    )
    ORDER BY distance_meters;
END;
$$;

-- Función para búsqueda semántica (RAG)
CREATE OR REPLACE FUNCTION match_locations(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    category TEXT,
    coordinates geography,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.name,
        l.description,
        l.category,
        l.coordinates,
        1 - (l.embedding <=> query_embedding) AS similarity
    FROM locations l
    WHERE l.embedding IS NOT NULL
    AND 1 - (l.embedding <=> query_embedding) > match_threshold
    ORDER BY l.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Habilitar Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow all for authenticated users" ON locations
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON users
    FOR ALL TO authenticated USING (true);

-- Insertar datos de ejemplo
INSERT INTO locations (name, description, category, coordinates) VALUES
('Restaurante La Casa', 'Restaurante tradicional español con cocina casera', 'restaurant', ST_SetSRID(ST_MakePoint(-3.703790, 40.416775), 4326)::geography),
('Parque del Retiro', 'Beautiful historic park with lake and gardens', 'parque', ST_SetSRID(ST_MakePoint(-3.683473, 40.415243), 4326)::geography),
('Museo del Prado', 'Famous art museum with Spanish masterpieces', 'monumento', ST_SetSRID(ST_MakePoint(-3.692140, 40.413819), 4326)::geography),
('Hotel Gran Vía', 'Luxury hotel in the heart of the city', 'hotel', ST_SetSRID(ST_MakePoint(-3.705320, 40.419210), 4326)::geography),
('Tienda de Souvenirs', 'Traditional crafts and gifts shop', 'tienda', ST_SetSRID(ST_MakePoint(-3.704250, 40.418500), 4326)::geography)
ON CONFLICT DO NOTHING;