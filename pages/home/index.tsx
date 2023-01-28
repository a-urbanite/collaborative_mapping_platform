import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useFireStoreContext } from "../../components/FireStoreContext";

export default function Home() {
  const { fetchAllFirestoreMarkers, allFirestoreMarkers } = useFireStoreContext();

  useEffect(() => {
    fetchAllFirestoreMarkers();
  }, []);

  return (
    <>
      <div className={styles.homeContainer}>
        <MapLoader markers={allFirestoreMarkers} />
      </div>
    </>
  );
}
