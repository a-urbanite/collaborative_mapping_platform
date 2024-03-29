import React from "react";
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from "../../components/MarkerList/MarkerList";
import UploadButton from "../../components/MarkerList/UploadButton/UploadButton";
import styles from "./myPlaces.module.scss";
import { useRouter } from "next/router";
import { auth } from "../../firebase-config";
import { useMarkerContext } from "../../components/Map/MarkerContext";

const MyPlaces = () => {
  const router = useRouter();
  const { userMarkers, defineUserMarkers, allMarkers } = useMarkerContext();

  React.useEffect(() => {
    if (!auth.currentUser) {
      router.push("/home");
    } else {
      defineUserMarkers(allMarkers, auth.currentUser);
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mapContainer}>
        <MapLoader markers={userMarkers} />
      </div>
      <div className={styles.sidebar}>
        <MarkerList />
        <UploadButton />
      </div>
    </div>
  );
};

export default MyPlaces;
