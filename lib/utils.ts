export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(2)} km`
}

export function parseCoordinates(coords: unknown): { lat: number; lng: number } | null {
  if (!coords || typeof coords !== 'string') return null
  
  const match = coords.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/)
  if (match) {
    return {
      lat: parseFloat(match[2]),
      lng: parseFloat(match[1]),
    }
  }
  return null
}