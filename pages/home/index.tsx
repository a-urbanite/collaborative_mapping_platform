import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useMarkerContext } from "../../components/MarkerContext";
import { useModalContext } from "../../components/ModalContext";
import { useFirestoreController } from "../../components/FirestoreController";
import { useModal2 } from "../../components/Modal2/Modal2Context";

export default function Home() {
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal2();
  const { fetchAllMarkers, markersUpdated, initialFetch } = useFirestoreController();
  const { setAllFirestoreMarkers } = useMarkerContext();
  // const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();

  useEffect(() => {
    if (initialFetch || markersUpdated) {
      openModalWithSpinner("Fetching Markers...");
      fetchAllMarkers()
        .then((markerMap: any) => {
          if (markerMap.length === 0) {throw new Error("fetched data contains no marker")}
          setAllFirestoreMarkers(markerMap);
          closeModal()
        })
        .catch((e: any) => {
          console.error(e)
          openModalWithError(`Error connecting to Server (message: ${e.message})`)
        })
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <MapLoader />
    </div>
  );
}
