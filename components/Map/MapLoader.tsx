import React from 'react'
import dynamic from 'next/dynamic'

const MapLoader = ({ markers }: any) => {

  const Map = dynamic(
    () => import('./Map'),
    { 
      loading: () => <p>Map is loading</p>,
      ssr: false
    }
  )

  return (
    <Map markers={markers}/>
  )
}

export default MapLoader