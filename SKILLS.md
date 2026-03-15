# SKILLS - GeoRAG

## Required Skills

### Core
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Supabase
- PostgreSQL with PostGIS
- pgvector extension
- Edge Functions (Deno)
- Row Level Security (RLS)

### APIs
- OpenAI Embeddings API
- REST API routes

### Maps
- Leaflet
- React-Leaflet

## Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.0",
  "leaflet": "^1.9.4",
  "next": "14.0.4",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-leaflet": "^4.2.1"
}
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
```

## Database Functions
- `find_locations_nearby(lat, lng, radius_km)` - Búsqueda geográfica
- `match_locations(query_embedding, threshold, count)` - Búsqueda vectorial

## Edge Functions
- `create-embedding` - Crear ubicación con embedding
- `search-nearby` - Búsqueda por proximidad
- `search-similar` - Búsqueda semántica
- `hybrid-search` - Búsqueda combinada