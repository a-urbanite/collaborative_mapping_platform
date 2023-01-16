import React from "react";
import { useMapRefContext } from "../../MapRefContext";
import styles from './MarkerCard.module.scss'

const MarkerCard = ({ marker, i }: any) => {
  const mapInstance = useMapRefContext().getMapInstance();

  const highlightMarker = (marker: any) => {
    console.log(marker);
    // marker.setIcon(bigIcon);
    mapInstance.panTo(marker.getLatLng());
  };

  return (
    <li
      onMouseOver={(e) => {
        // console.log("hover!");
        highlightMarker(marker);
      }}
    >
      <div className={styles.container}>Feature {i + 1}</div>
    </li>
  );
};

export default MarkerCard;
