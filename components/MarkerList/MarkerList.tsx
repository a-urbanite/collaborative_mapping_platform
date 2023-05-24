import React, { useEffect } from "react";
// import { useMapContext } from "../MapContext";
import MarkerCard from "./MarkerCard/MarkerCard";
import UploadButton from "./UploadButton/UploadButton";
import styles from "./markerList.module.scss";
import { useMarkerContext } from "../MarkerContext";

const MarkerList = () => {
  const { userMarkers } = useMarkerContext();

  // useEffect(() => {
  //   console.log("usermarkers", userMarkers);
  // }, [userMarkers]);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {[...userMarkers.keys()].map((k) => {
          const marker = userMarkers.get(k);
          if (marker.properties.operationIndicator == "deleted in current session") { return };
          return <MarkerCard key={k} marker={marker} />;
        })}
      </ul>
      {userMarkers.length > 0 && <UploadButton />}
    </div>
  );
};

export default MarkerList;
