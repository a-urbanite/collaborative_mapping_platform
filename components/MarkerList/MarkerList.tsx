import React from "react";
import { useMapContext } from "../MapContext";
import MarkerCard from "./MarkerCard/MarkerCard";
import UploadButton from "./UploadButton/UploadButton";
import styles from "./markerList.module.scss"

const MarkerList = () => {
  const { drawnMarkers } = useMapContext();

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {drawnMarkers.map((marker: any, i: any) => <MarkerCard key={i} marker={marker}/>)}
      </ul>
      { drawnMarkers.length > 0 && <UploadButton/>}
    </div>
  );
};

export default MarkerList;
