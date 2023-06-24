import React from 'react'
import { useMarkerContext } from '../../../components/Map/MarkerContext'

const Index = () => {
  const { allMarkers } = useMarkerContext();
  
  React.useEffect(() => {
    console.log("ALLMARKERS: ", allMarkers)
  }, [allMarkers])


  return (
    <div>index</div>
  )
}

export default Index