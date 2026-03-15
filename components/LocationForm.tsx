'use client'

import { useState } from 'react'
import { supabase, LocationInput } from '@/lib/supabase'

interface LocationFormProps {
  onLocationAdded?: () => void
  initialCoordinates?: { lat: number; lng: number } | null
}

export default function LocationForm({ onLocationAdded, initialCoordinates }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationInput>({
    name: '',
    description: '',
    latitude: initialCoordinates?.lat || 0,
    longitude: initialCoordinates?.lng || 0,
    category: 'general',
    metadata: {},
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al crear la ubicación')
      }

      setFormData({
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
        category: 'general',
        metadata: {},
      })
      onLocationAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold">Agregar Ubicación</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Latitud</label>
          <input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitud</label>
          <input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="general">General</option>
          <option value="restaurant">Restaurante</option>
          <option value="hotel">Hotel</option>
          <option value="tienda">Tienda</option>
          <option value="parque">Parque</option>
          <option value="monumento">Monumento</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Ubicación'}
      </button>
    </form>
  )
}