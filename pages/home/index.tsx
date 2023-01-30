import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useFireStoreContext } from "../../components/FireStoreContext";
import { useModalContext } from "../../components/ModalContext";

export default function Home() {
  const { fetchAllFirestoreMarkers, allFirestoreMarkers } = useFireStoreContext();
  const { openModalWithSpinner, closeModal } = useModalContext();


  useEffect(() => {
    openModalWithSpinner()
    fetchAllFirestoreMarkers();
  }, []);
  
  useEffect(() => {
    if (allFirestoreMarkers.length > 0) {
      closeModal();
    }
  }, [allFirestoreMarkers])
  

  return (
    <>
      <div className={styles.homeContainer}>
        <MapLoader markers={allFirestoreMarkers} />
      </div>
    </>
  );
}
