import React from 'react'
import dynamic from 'next/dynamic'

const MapLoader = () => {

  const Map = dynamic(
    () => import('./Map'),
    { 
      loading: () => <p>Map is loading</p>,
      ssr: false
    }
  )

  return (
    <Map />
  )
}

export default MapLoader