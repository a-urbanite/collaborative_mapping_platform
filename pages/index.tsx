import MapLoader from "../components/Map/MapLoader";
import { MapContextProvider } from "../components/MapContext";
import { ModalContextProvider } from "../components/ModalContext";
import MarkerList from "../components/MarkerList/MarkerList";
import Modal from "../components/Modal/Modal";
import styles from '../styles/home.module.scss'

export default function Home() {
  return (
    <>
      <MapContextProvider>
        <ModalContextProvider>
              <Modal />
              <div className={styles.homeContainer}>
                <MapLoader />
                <MarkerList />
              </div>
        </ModalContextProvider>
      </MapContextProvider>
    </>
  );
}
