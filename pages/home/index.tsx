import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useFireStoreContext } from "../../components/FireStoreContext";
import { useModalContext } from "../../components/ModalContext";
import { useFirestoreController } from "../../components/FirestoreController";

export default function Home() {
  const { fetchAllMarkers } = useFirestoreController();
  const { setAllFirestoreMarkers } = useFireStoreContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();

  useEffect(() => {
    openModalWithSpinner("Fetching Markers...");
    fetchAllMarkers()
      .then((markerMap: any) => {
        // console.log("markerMap", markerMap)
        setAllFirestoreMarkers(markerMap);
        closeModal()
      })
      .catch((e: any) => {
        console.error(e)
        openModalWithError()
      })
  }, []);

  return (
    <div className={styles.homeContainer}>
      <MapLoader />
    </div>
  );
}
