import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseKey)

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    const lat = parseFloat(url.searchParams.get('lat') || '0')
    const lng = parseFloat(url.searchParams.get('lng') || '0')
    const radius = parseFloat(url.searchParams.get('radius') || '10')
    const query = url.searchParams.get('q') || ''
    const limit = parseInt(url.searchParams.get('limit') || '10')

    let results: Array<Record<string, unknown>> = []

    if (query) {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: query,
        }),
      })

      const embeddingData = await embeddingResponse.json()
      const embedding = embeddingData.data?.[0]?.embedding

      if (embedding && lat && lng) {
        const { data: geoData } = await supabase.rpc('find_locations_nearby', {
          lat,
          lng,
          radius_km: radius,
        })

        const { data: semanticData } = await supabase.rpc('match_locations', {
          query_embedding: embedding,
          match_threshold: 0.5,
          match_count: limit * 2,
        })

        const semanticIds = new Set(semanticData?.map((r: { id: unknown }) => r.id) || [])
        const geoIds = new Set(geoData?.map((r: { id: unknown }) => r.id) || [])

        const combinedResults = [...semanticData, ...geoData].filter((item: Record<string, unknown>) => {
          return semanticIds.has(item.id) || geoIds.has(item.id)
        })

        results = combinedResults.slice(0, limit)
      }
    } else if (lat && lng) {
      const { data } = await supabase.rpc('find_locations_nearby', {
        lat,
        lng,
        radius_km: radius,
      })
      results = (data || []).slice(0, limit)
    }

    return new Response(
      JSON.stringify({ locations: results }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})