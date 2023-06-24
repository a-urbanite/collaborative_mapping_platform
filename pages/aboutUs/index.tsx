import React from 'react'
import { useMarkerContext } from '../../components/Map/MarkerContext';

const AboutUs = () => {
  const { allMarkers } = useMarkerContext();
  
  React.useEffect(() => {
    console.log("ALLMARKERS: ", allMarkers)
  }, [allMarkers])

  return (
    <div>AboutUs</div>
  )
}

export default AboutUs