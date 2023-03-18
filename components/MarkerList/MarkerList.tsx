import React, { useEffect } from "react";
import { useMapContext } from "../MapContext";
import MarkerCard from "./MarkerCard/MarkerCard";
import UploadButton from "./UploadButton/UploadButton";
import styles from "./markerList.module.scss"
import { useFireStoreContext } from "../FireStoreContext";

const MarkerList = () => {
  const { userFirestoreMarkers } = useFireStoreContext();

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {userFirestoreMarkers.map((marker: any, i: any) => {
          if (marker.properties.operationIndicator !== "deleted in current session") {
            return <MarkerCard key={i} marker={marker}/>
          }
          })}
      </ul>
      {userFirestoreMarkers.length > 0 && <UploadButton/>}
    </div>
  );
};

export default MarkerList;
