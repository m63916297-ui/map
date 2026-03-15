import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseKey)

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    const lat = parseFloat(url.searchParams.get('lat') || '0')
    const lng = parseFloat(url.searchParams.get('lng') || '0')
    const radius = parseFloat(url.searchParams.get('radius') || '10')
    const limit = parseInt(url.searchParams.get('limit') || '20')

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'Missing lat/lng parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = await supabase.rpc('find_locations_nearby', {
      lat,
      lng,
      radius_km: radius,
    })

    if (error) throw error

    const limitedData = data?.slice(0, limit) || []

    return new Response(
      JSON.stringify({ locations: limitedData }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})