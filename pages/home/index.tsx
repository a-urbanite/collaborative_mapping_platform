import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useFireStoreContext } from "../../components/FireStoreContext";
import { useModalContext } from "../../components/ModalContext";

export default function Home() {
  const {
    fetchAllFirestoreMarkers,
    setAllFirestoreMarkers,
    markersUpdated,
    setmarkersUpdated,
    initialFetch,
    setinitialFetch,
  } = useFireStoreContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();

  useEffect(() => {
    if (initialFetch || markersUpdated) {
      setmarkersUpdated(false);
      openModalWithSpinner("Fetching Markers...");
      fetchAllFirestoreMarkers()
        .then((markers: any) => {
          setAllFirestoreMarkers(markers);
          setinitialFetch(false);
          closeModal(500);
        })
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
