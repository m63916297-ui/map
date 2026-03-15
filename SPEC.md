# Sistema de Geolocalización con RAG

## 1. Project Overview

- **Nombre**: GeoRAG - Sistema de Geolocalización Inteligente
- **Tipo**: Full-stack webapp con Supabase (Backend) + Next.js (Frontend)
- **Funcionalidad**: Sistema de geolocalización que permite almacenar, buscar y analizar ubicaciones usando PostGIS para operaciones geoespaciales y pgvector para búsqueda semántica (RAG) de descripciones de lugares
- **Usuarios**: Desarrolladores que necesitan infraestructura de geolocalización con capacidades de IA

## 2. Stack Tecnológico

### Backend
- **Supabase**: Base de datos PostgreSQL con PostGIS y pgvector
- **Edge Functions**: Funciones serverless en Deno Deploy
- **PostGIS**: Extensión para datos geoespaciales
- **pgvector**: Extensión para embeddings y búsqueda de similitud

### Frontend
- **Next.js 14**: Framework React con App Router
- **Leaflet**: Librería de mapas interactivos
- **Tailwind CSS**: Estilos
- **Supabase Client**: Cliente JS para Supabase

## 3. Base de Datos

### Tablas

#### `locations` - Lugares georreferenciados
```sql
- id: uuid (PK)
- name: text (nombre del lugar)
- description: text (descripción para RAG)
- embedding: vector(1536) (embedding de OpenAI)
- coordinates: geography(Point, 4326) (posición GPS)
- category: text (categoría)
- metadata: jsonb (datos adicionales)
- created_at: timestamptz
- updated_at: timestamptz
```

#### `users` - Usuarios
```sql
- id: uuid (PK)
- email: text
- name: text
- created_at: timestamptz
```

### Índices
- GiST en columna `coordinates` para búsquedas geoespaciales
- IVFFlat en columna `embedding` para búsqueda vectorial

## 4. Edge Functions (Deno)

### `create-embedding`
- Genera embedding de descripción usando OpenAI
- Inserta ubicación con embedding en base de datos

### `search-nearby`
- Búsqueda de lugares dentro de radio (PostGIS)
- Parámetros: lat, lng, radius_km

### `search-similar`
- Búsqueda semántica por similitud (pgvector)
- Parámetros: query, limit

### `hybrid-search`
- Búsqueda combinada geográfica + semántica
- Parámetros: lat, lng, radius_km, query, limit

## 5. Frontend (Next.js)

### Páginas

#### `/` - Mapa principal
- Visualización de mapa Leaflet
- Marcadores de ubicaciones
- Panel de búsqueda
- Formulario para agregar lugares

#### `/search` - Búsqueda avanzada
- Búsqueda por texto (RAG)
- Filtros por categoría
- Resultados con distancia

### Componentes

- `Map`: Mapa interactivo con Leaflet
- `LocationMarker`: Marcador en el mapa
- `SearchPanel`: Panel de búsqueda
- `LocationForm`: Formulario para agregar lugares
- `LocationList`: Lista de resultados

## 6. API Routes

### `GET /api/locations`
- Lista todas las ubicaciones

### `POST /api/locations`
- Crea nueva ubicación (con embedding)

### `GET /api/locations/nearby`
- Busca ubicaciones cercanas

### `GET /api/locations/search`
- Búsqueda semántica

## 7. Variables de Entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## 8. Funcionalidades

1. **Agregar ubicaciones**: Formulario con nombre, descripción, coordenadas, categoría
2. **Visualización en mapa**: Marcadores interactivos con info windows
3. **Búsqueda geográfica**: Encontrar lugares dentro de un radio
4. **Búsqueda semántica**: Encontrar lugares por descripción相似
5. **Búsqueda híbrida**: Combina ubicación + descripción

## 9. Estructura de Archivos

```
mapa/
├── supabase/
│   └── migrations/
│       └── 001_setup.sql
├── supabase/
│   └── functions/
│       ├── create-embedding/
│       │   └── index.ts
│       ├── search-nearby/
│       │   └── index.ts
│       ├── search-similar/
│       │   └── index.ts
│       └── hybrid-search/
│           └── index.ts
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
│       └── locations/
│           └── route.ts
├── components/
│   ├── Map.tsx
│   ├── LocationForm.tsx
│   └── SearchPanel.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```