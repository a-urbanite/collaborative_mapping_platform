import React from "react";
import MarkerCard from "./MarkerCard/MarkerCard";
import UploadButton from "./UploadButton/UploadButton";
import styles from "./markerList.module.scss";
import { useMarkerContext } from "../MarkerContext";

const MarkerList = () => {
  const { userMarkers } = useMarkerContext();

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {[...userMarkers.keys()].map((k) => {
          const marker = userMarkers.get(k);
          // if (marker) {
          //   if (marker.properties.operationIndicator === "deleted in current session") { return };
          //   return <MarkerCard key={k} marker={marker} />;
          // }
          if (marker && marker.properties.operationIndicator !== "deleted in current session") {
            return <MarkerCard key={k} marker={marker} />;
          }
          return null; // Add a fallback return statement for the map function
        })}
      </ul>
      {userMarkers.size > 0 && <UploadButton />}
    </div>
  );
};

export default MarkerList;
