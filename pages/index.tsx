import MapLoader from "../components/Map/MapLoader";
import { DrawingContextProvider } from "../components/DrawingContext";
import { MapRefContextProvider } from "../components/MapRefContext";
import { ModalContextProvider } from "../components/ModalContext";
import MarkerList from "../components/MarkerList/MarkerList";
import Modal from "../components/Modal/Modal";

export default function Home() {
  return (
    <>
    <ModalContextProvider>
      <MapRefContextProvider>
        <DrawingContextProvider>
          <Modal/>
          <MapLoader />
          <MarkerList />
        </DrawingContextProvider>
      </MapRefContextProvider>
    </ModalContextProvider>
    </>
  );
}
