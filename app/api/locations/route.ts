import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')

  try {
    if (type === 'search') {
      const query = searchParams.get('q') || ''
      const limit = parseInt(searchParams.get('limit') || '10')

      const { data: embeddings } = await fetch(
        `https://api.openai.com/v1/embeddings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: query,
          }),
        }
      ).then(res => res.json())

      if (!embeddings) {
        return NextResponse.json({ locations: [] })
      }

      const embedding = embeddings[0]?.embedding

      const { data: locations } = await supabase.rpc('match_locations', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: limit,
      })

      return NextResponse.json({ locations: locations || [] })
    }

    if (type === 'nearby') {
      const lat = parseFloat(searchParams.get('lat') || '0')
      const lng = parseFloat(searchParams.get('lng') || '0')
      const radius = parseFloat(searchParams.get('radius') || '10')

      const { data: locations } = await supabase.rpc('find_locations_nearby', {
        lat,
        lng,
        radius_km: radius,
      })

      return NextResponse.json({ locations: locations || [] })
    }

    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ locations: locations || [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, latitude, longitude, category, metadata } = body

    if (!name || !description || !latitude || !longitude) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const embeddingsResponse = await fetch(
      'https://api.openai.com/v1/embeddings',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: description,
        }),
      }
    )

    const embeddings = await embeddingsResponse.json()
    const embedding = embeddings.data?.[0]?.embedding

    const { data, error } = await supabase
      .from('locations')
      .insert({
        name,
        description,
        category,
        metadata,
        coordinates: `POINT(${longitude} ${latitude})`,
        embedding,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ location: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al crear ubicación' }, { status: 500 })
  }
}