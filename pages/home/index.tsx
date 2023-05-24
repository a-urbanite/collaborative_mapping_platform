import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useMarkerContext } from "../../components/MarkerContext";
import { useFirestoreController } from "../../components/FirestoreController";
import { useModal } from "../../components/Modal/ModalContext";

export default function Home() {
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal();
  const { fetchAllMarkers, markersUpdated, initialFetch } = useFirestoreController();
  const { setAllMarkers, allMarkers } = useMarkerContext();

  const dataFetch = async () => {
    const markerMap = await fetchAllMarkers();
    await setAllMarkers(markerMap);
  };

  useEffect(() => {
    if (!initialFetch && !markersUpdated) return;

    try {
      openModalWithSpinner("Fetching Markers...");
      dataFetch();
      closeModal();
    } catch (e: any) {
      console.error(e);
      openModalWithError(`Error connecting to Server (message: ${e.message})`);
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <MapLoader markers={allMarkers} />
    </div>
  );
}
