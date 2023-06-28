import React from "react";
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from "../../components/MarkerList/MarkerList";
import UploadButton from "../../components/MarkerList/UploadButton/UploadButton";
import styles from "./contribute.module.scss";
import { useMarkerContext } from "../../components/Map/MarkerContext";

const Contribute = () => {
  const { userMarkers, resetUserMarkers } = useMarkerContext();

  React.useEffect(() => {
    resetUserMarkers()
  }, [])
  
  
  return (
    <>
      <p>Contribute</p>
      <div className={styles.homeContainer}>
        <div className={styles.mapContainer}>
          <MapLoader markers={userMarkers} />
        </div>
        <div className={styles.sidebar}>
          <MarkerList />
          <UploadButton />
        </div>
      </div>
    </>
  );
};

export default Contribute;
