import MapLoader from "../components/Map/MapLoader";
import { MapContextProvider } from "../components/MapContext";
import { ModalContextProvider } from "../components/ModalContext";
import MarkerList from "../components/MarkerList/MarkerList";
import Modal from "../components/Modal/Modal";

export default function Home() {
  return (
    <>
      <MapContextProvider>
        <ModalContextProvider>
              <Modal />
              <MapLoader />
              <MarkerList />
        </ModalContextProvider>
      </MapContextProvider>
    </>
  );
}
