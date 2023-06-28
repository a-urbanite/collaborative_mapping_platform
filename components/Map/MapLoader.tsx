import React from 'react'
import dynamic from 'next/dynamic'

const MapLoader = ({markers, className}: any) => {

  const Map = dynamic(
    () => import('./Map'),
    { 
      loading: () => <p>Map is loading</p>,
      ssr: false
    }
  )

  return (
    <Map markers={markers} className={className}/>
  )
}

export default MapLoader