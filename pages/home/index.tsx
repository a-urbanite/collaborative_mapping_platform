import React from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useMarkerContext } from "../../components/Map/MarkerContext";
import { useFirestoreController } from "../../components/FirestoreController/FirestoreController";
import { useModal } from "../../components/Modal/ModalContext";
import { useRouter } from "next/router";

export default function Home() {
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal();
  const { fetchAllMarkers, markersUpdated, initialFetch } = useFirestoreController();
  const { setAllMarkers, allMarkers } = useMarkerContext();

  React.useEffect(() => {
    if (!initialFetch && !markersUpdated) return;

    openModalWithSpinner("Fetching Markers...");
    fetchAllMarkers()
      .then((markers) => {
        setAllMarkers(markers);
        closeModal();
      })
      .catch((e) => {
        openModalWithError(`Error connecting to Server (${e.cause})`);
      });
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mapContainer}>
        <MapLoader markers={allMarkers} />
      </div>
    </div>
  );
}
