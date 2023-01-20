import React from "react";
import { useMapRefContext } from "../../MapRefContext";
import { useModalContext } from "../../ModalContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker, i }: any) => {
  const mapInstance = useMapRefContext().getMapInstance();
  const { setModalOpen } = useModalContext()

  const highlightMarker = (marker: any) => {
    console.log(marker);
    // marker.setIcon(bigIcon);
    mapInstance.panTo(marker.getLatLng());
  };

  const addContent = (marker: any) => {
    setModalOpen(true)
    // marker.bindPopup("test")
    // marker.openPopup()
  };

  return (
    <li>
      <div
        onMouseOver={(e) => highlightMarker(marker)}
        className={styles.container}
      >
        <div className={styles.textbar}>Feature {i + 1}</div>
        <div className={styles.buttonbar}>
          {/* <button>Edit</button>
          <button>Delete</button> */}
          <button onClick={() => addContent(marker)}>Add Content</button>
        </div>
      </div>
    </li>
  );
};

export default MarkerCard;
