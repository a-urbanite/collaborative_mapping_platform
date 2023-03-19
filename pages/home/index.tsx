import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useFireStoreContext } from "../../components/FireStoreContext";
import { useModalContext } from "../../components/ModalContext";

export default function Home() {
  const { fetchAllFirestoreMarkers, allFirestoreMarkers, markersUpdated, setmarkersUpdated, initialFetch } = useFireStoreContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();

  useEffect(() => {
    console.log("markersUpdated: ", markersUpdated)
  }, [markersUpdated])

  useEffect(() => {
    console.log("initialFetch: ", initialFetch)
  }, [initialFetch])

  useEffect(() => {
    if( initialFetch || markersUpdated ) {
      setmarkersUpdated(false)
      openModalWithSpinner("Fetching Markers...");
      fetchAllFirestoreMarkers()
        .then(() => closeModal(500))
        .catch(() => openModalWithError());
    }
  }, []);

  return (
    <>
      <div className={styles.homeContainer}>
        <MapLoader />
      </div>
    </>
  );
}
