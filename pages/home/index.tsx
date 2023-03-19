import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useFireStoreContext } from "../../components/FireStoreContext";
import { useModalContext } from "../../components/ModalContext";

export default function Home() {
  const {
    fetchMarkersAJAX,
    setAllFirestoreMarkers,
    markersUpdated,
    setmarkersUpdated,
    initialFetch,
    setinitialFetch,
  } = useFireStoreContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();

  useEffect(() => {
    if (initialFetch || markersUpdated) {
      openModalWithSpinner("Fetching Markers...");
      fetchMarkersAJAX()
      .then((markers: any) => {
        setAllFirestoreMarkers(markers);
          setmarkersUpdated(false);
          setinitialFetch(false);
          closeModal(500);
        })
        .catch((err: any) => {
          console.error(err);
          openModalWithError()
        });
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
