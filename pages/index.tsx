import MapLoader from "../components/Map/MapLoader"
import { DrawingContextProvider } from '../components/DrawingContext'

export default function Home() {
  
  return (
    <>
      <DrawingContextProvider>
        <MapLoader/>
      </DrawingContextProvider>
    </>
  )
}
