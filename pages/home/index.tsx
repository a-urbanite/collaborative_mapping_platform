import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useMarkerContext } from "../../components/MarkerContext";
import { useModalContext } from "../../components/ModalContext";
import { useFirestoreController } from "../../components/FirestoreController";

export default function Home() {
  const { fetchAllMarkers, markersUpdated, initialFetch } = useFirestoreController();
  const { setAllFirestoreMarkers } = useMarkerContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();

  useEffect(() => {
    if (initialFetch || markersUpdated) {
      openModalWithSpinner("Fetching Markers...");
      fetchAllMarkers()
        .then((markerMap: any) => {
          setAllFirestoreMarkers(markerMap);
          closeModal()
        })
        .catch((e: any) => {
          console.error(e)
          openModalWithError()
        })
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <MapLoader />
    </div>
  );
}
