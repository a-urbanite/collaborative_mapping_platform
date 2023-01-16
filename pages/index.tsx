import MapLoader from "../components/Map/MapLoader";
import { DrawingContextProvider } from "../components/DrawingContext";
import { MapRefContextProvider } from "../components/MapRefContext";
import MarkerList from "../components/MarkerList/MarkerList";

export default function Home() {
  return (
    <>
      <MapRefContextProvider>
        <DrawingContextProvider>
          <MapLoader />
          <MarkerList />
        </DrawingContextProvider>
      </MapRefContextProvider>
    </>
  );
}
