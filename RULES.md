# RULES - GeoRAG

## Development Rules

### Environment Setup
1. Always use `.env.local.example` as template for environment variables
2. Never commit real API keys or secrets
3. Use Supabase Service Role Key only in server-side code

### Database
1. Always use parameterized queries to prevent SQL injection
2. Enable Row Level Security on all tables
3. Use `geography` type for PostGIS (not `geometry`)
4. Indexes: GiST for geographic, IVFFlat for vector

### API Routes
1. Validate all input parameters
2. Return proper HTTP status codes
3. Handle errors gracefully with try/catch
4. Use NextResponse for responses

### Frontend
1. Use 'use client' for components using hooks or browser APIs
2. Use dynamic import with ssr: false for Leaflet components
3. Handle loading states properly
4. Parse coordinates from WKT format (POINT)

### Edge Functions
1. Import createClient from esm.sh for Supabase
2. Use Deno.env.get() for environment variables
3. Return proper JSON responses with headers

## Code Style
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Tailwind for styling
- Keep components small and focused