import MapLoader from "../components/Map/MapLoader"
import { DrawingContextProvider } from '../components/DrawingContext'
import MarkerList from "../components/MarkerList/MarkerList"

export default function Home() {
  
  return (
    <>
      <DrawingContextProvider>
        <MapLoader/>
        <MarkerList/>
      </DrawingContextProvider>
    </>
  )
}
