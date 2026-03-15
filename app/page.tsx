import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <header className="bg-green-700 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">GeoRAG - Sistema de Geolocalización</h1>
      </header>
      <div className="flex-1 flex">
        <aside className="w-80 bg-white p-4 overflow-y-auto border-r">
          <LocationForm />
          <SearchPanel />
          <LocationList />
        </aside>
        <div className="flex-1">
          <MapWithNoSSR />
        </div>
      </div>
    </main>
  )
}

import LocationForm from '@/components/LocationForm'
import SearchPanel from '@/components/SearchPanel'
import LocationList from '@/components/LocationList'