'use client'

import { Location } from '@/lib/supabase'
import { parseCoordinates, formatDistance } from '@/lib/utils'

interface LocationListProps {
  locations: Location[]
  onSelectLocation?: (location: Location) => void
}

export default function LocationList({ locations, onSelectLocation }: LocationListProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Ubicaciones ({locations.length})</h2>
      
      {locations.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay ubicaciones</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {locations.map((location) => {
            const coords = parseCoordinates(location.coordinates)
            return (
              <li
                key={location.id}
                onClick={() => onSelectLocation?.(location)}
                className="p-3 bg-white rounded border cursor-pointer hover:bg-gray-50"
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                    {location.category}
                  </span>
                </div>
                {coords && (
                  <div className="text-xs text-gray-400 mt-1">
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {location.description}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}