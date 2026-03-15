'use client'

import { useState } from 'react'
import { Location } from '@/lib/supabase'

interface SearchPanelProps {
  onSearch: (query: string, radius: number) => Promise<Location[]>
}

export default function SearchPanel({ onSearch }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [radius, setRadius] = useState(10)
  const [searchType, setSearchType] = useState<'semantic' | 'nearby'>('nearby')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Location[]>([])

  const handleSearch = async () => {
    if (!query && searchType === 'semantic') return
    
    setLoading(true)
    try {
      const endpoint = searchType === 'semantic'
        ? `/api/locations/search?q=${encodeURIComponent(query)}&limit=10`
        : `/api/locations/nearby?lat=40.416775&lng=-3.70379&radius=${radius}`

      const response = await fetch(endpoint)
      const data = await response.json()
      setResults(data.locations || [])
    } catch (error) {
      console.error('Error en búsqueda:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold">Búsqueda</h2>

      <div className="flex gap-2">
        <button
          onClick={() => setSearchType('nearby')}
          className={`px-3 py-1 rounded text-sm ${
            searchType === 'nearby' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Cercana
        </button>
        <button
          onClick={() => setSearchType('semantic')}
          className={`px-3 py-1 rounded text-sm ${
            searchType === 'semantic' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Semántica
        </button>
      </div>

      {searchType === 'semantic' && (
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      )}

      {searchType === 'nearby' && (
        <div>
          <label className="block text-sm font-medium mb-1">Radio (km): {radius}</label>
          <input
            type="range"
            min="1"
            max="100"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      <button
        onClick={handleSearch}
        disabled={loading || (searchType === 'semantic' && !query)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Resultados ({results.length})</h3>
          <ul className="space-y-2">
            {results.map((loc) => (
              <li key={loc.id} className="p-2 bg-white rounded border text-sm">
                <strong>{loc.name}</strong>
                <span className="text-gray-500"> - {loc.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}