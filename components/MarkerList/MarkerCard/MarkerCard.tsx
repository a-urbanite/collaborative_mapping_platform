import React from "react";
import { useMapRefContext } from "../../MapRefContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker, i }: any) => {
  const mapInstance = useMapRefContext().getMapInstance();

  const highlightMarker = (marker: any) => {
    console.log(marker);
    // marker.setIcon(bigIcon);
    mapInstance.panTo(marker.getLatLng());
  };

  return (
    <li>
      <div
        onMouseOver={(e) => {
          // console.log("hover!");
          highlightMarker(marker);
        }}
        className={styles.container}
      >
        <div className={styles.textbar}>Feature {i + 1}</div>
        <div className={styles.buttonbar}>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </li>
  );
};

export default MarkerCard;
