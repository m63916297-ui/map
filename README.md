# GeoRAG - Sistema de Geolocalización con RAG

Sistema de geolocalización inteligente que combina PostGIS para búsquedas geoespaciales y pgvector para búsquedas semánticas (RAG) usando embeddings de OpenAI.

## Tech Stack

- **Backend**: Supabase (PostgreSQL + PostGIS + pgvector)
- **Edge Functions**: Deno Deploy
- **Frontend**: Next.js 14 (App Router)
- **Mapas**: Leaflet / React-Leaflet
- **IA**: OpenAI Embeddings API

## Características

- 🗺️ Visualización de ubicaciones en mapa interactivo
- 📍 Búsqueda geográfica por radio (PostGIS)
- 🔍 Búsqueda semántica por descripción (pgvector + RAG)
- 🔄 Búsqueda híbrida combinada
- ➕ Agregar ubicaciones con embedding automático
- 🏷️ Categorización de lugares

## Estructura del Proyecto

```
mapa/
├── app/                    # Next.js App Router
│   ├── api/locations/      # API Routes
│   ├── page.tsx           # Página principal
│   └── layout.tsx         # Layout
├── components/            # Componentes React
│   ├── Map.tsx            # Mapa Leaflet
│   ├── LocationForm.tsx   # Formulario de ubicación
│   ├── SearchPanel.tsx    # Panel de búsqueda
│   └── LocationList.tsx  # Lista de ubicaciones
├── lib/                   # Utilidades
│   ├── supabase.ts        # Cliente Supabase
│   └── utils.ts           # Funciones helper
├── supabase/
│   ├── migrations/        # SQL migrations
│   └── functions/         # Edge Functions Deno
│       ├── create-embedding/
│       ├── search-nearby/
│       ├── search-similar/
│       └── hybrid-search/
└── .github/workflows/     # CI/CD
```

## Setup

### 1. Variables de Entorno

Copiar `.env.local.example` a `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
OPENAI_API_KEY=tu_openai_key
```

### 2. Base de Datos

Ejecutar `supabase/migrations/001_setup.sql` en el SQL Editor de Supabase:

- Habilita PostGIS y pgvector
- Crea tablas `locations` y `users`
- Crea índices GiST e IVFFlat
- Define funciones RPC `find_locations_nearby` y `match_locations`
- Inserta datos de ejemplo

### 3. Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Desplegar funciones
supabase functions deploy create-embedding
supabase functions deploy search-nearby
supabase functions deploy search-similar
supabase functions deploy hybrid-search
```

### 4. Frontend

```bash
cd mapa
npm install
npm run dev
```

## API

### GET /api/locations

Listar ubicaciones o buscar.

Parámetros:
- `type=search&q=query` - Búsqueda semántica
- `type=nearby&lat=x&lng=y&radius=km` - Búsqueda geográfica

### POST /api/locations

Crear nueva ubicación.

```json
{
  "name": "Restaurante Ejemplo",
  "description": "Restaurante con cocina tradicional",
  "latitude": 40.416775,
  "longitude": -3.70379,
  "category": "restaurant"
}
```

## Funciones de Base de Datos

### find_locations_nearby(lat, lng, radius_km)
Busca lugares dentro de un radio usando PostGIS.

### match_locations(query_embedding, threshold, count)
Busca lugares por similitud de embedding (RAG).

## Despliegue

### Vercel (Frontend)
```bash
vercel deploy
```

### Supabase Edge Functions
Desplegadas automáticamente via GitHub Actions (ver `.github/workflows/`).

## Licencia

MIT