import React from 'react'
import { useMap } from 'react-leaflet'
import { useDrawingContext } from '../DrawingContext'

const MarkerList = () => {
  const { getDrawnMarkers } = useDrawingContext()
  const drawnMarkers = getDrawnMarkers();

  // const map = useMap()
  return (
    <div>
      <ul>
        {drawnMarkers.map((marker: any, i: any) => {
          console.log(marker)
          return <li key={i}>Feature {i+1} - {marker.geometry.type}</li>
        })}
      </ul>
    </div>
  )
}

export default MarkerList