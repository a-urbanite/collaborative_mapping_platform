import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useFireStoreContext } from "../../components/FireStoreContext";
import { useModalContext } from "../../components/ModalContext";

export default function Home() {
  const { fetchAllMarkers } = useFireStoreContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();

  useEffect(() => {
    openModalWithSpinner("Fetching Markers...");
    fetchAllMarkers()
      .then(() => closeModal())
      .catch(() => openModalWithError())
  }, []);

  return (
    <div className={styles.homeContainer}>
      <MapLoader />
    </div>
  );
}
