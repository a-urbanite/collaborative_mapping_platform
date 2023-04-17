import React, { useEffect } from "react";
// import { useMapContext } from "../MapContext";
import MarkerCard from "./MarkerCard/MarkerCard";
import UploadButton from "./UploadButton/UploadButton";
import styles from "./markerList.module.scss";
import { useMarkerContext } from "../MarkerContext";

const MarkerList = () => {
  const { userFirestoreMarkers } = useMarkerContext();

  useEffect(() => {
    console.log("usermarkers", userFirestoreMarkers);
  }, [userFirestoreMarkers]);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {[...userFirestoreMarkers.keys()].map((k) => {
          const marker = userFirestoreMarkers.get(k);
          if (marker.properties.operationIndicator !== "deleted in current session") {
            return <MarkerCard key={k} marker={marker} />;
          }
        })}
      </ul>
      {userFirestoreMarkers.length > 0 && <UploadButton />}
    </div>
  );
};

export default MarkerList;
