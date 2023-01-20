import React from "react";
import { useDrawingContext } from "../DrawingContext";

import MarkerCard from "./MarkerCard/MarkerCard";
import UploadButton from "./UploadButton/UploadButton";
import styles from "./markerList.module.scss"

const MarkerList = () => {
  const drawnMarkers = useDrawingContext().getDrawnMarkers();

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {drawnMarkers.map((marker: any, i: any) => <MarkerCard key={i} marker={marker} i={i}/>)}
      </ul>
      <UploadButton/>
    </div>
  );
};

export default MarkerList;
