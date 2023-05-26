import React from "react";
import MarkerCard from "./MarkerCard/MarkerCard";
import styles from "./markerList.module.scss";
import { useMarkerContext } from "../Map/MarkerContext";

const MarkerList = () => {
  const { userMarkers } = useMarkerContext();

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {[...userMarkers.keys()].map((k) => {
          const marker = userMarkers.get(k);
          if (marker && marker.properties.operationIndicator !== "deleted in current session") {
            return <MarkerCard key={k} marker={marker} />;
          }
          return null;
        })}
      </ul>
    </div>
  );
};

export default MarkerList;
