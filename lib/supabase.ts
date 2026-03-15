import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Location {
  id: string
  name: string
  description: string
  embedding?: number[]
  coordinates: unknown
  category: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface LocationInput {
  name: string
  description: string
  latitude: number
  longitude: number
  category: string
  metadata?: Record<string, unknown>
}