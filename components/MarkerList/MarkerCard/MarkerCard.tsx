import React from "react";
import { useMapRefContext } from "../../MapRefContext";
import { useModalContext } from "../../ModalContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker, i }: any) => {
  const { mapRef } = useMapRefContext();
  const { setModal } = useModalContext();

  const highlightMarker = () => {
    mapRef.panTo(marker.mapLayerObj.getLatLng());
  };

  const openFormModal = () => {
    setModal({ isOpen: true, context: "markerContentForm", currentMarker: marker });
  };

  return (
    <li className={styles.listItem}>
      <div onMouseOver={() => highlightMarker()} className={styles.container}>
        <div className={styles.textbar}>Feature {i + 1}</div>
        <div className={styles.buttonbar}>
          <button className={styles.button}>Delete</button>
          <button className={styles.button} onClick={() => openFormModal()}>
            { marker._popup ? "edit content" : "add content"}
          </button>
        </div>
      </div>
    </li>
  );
};

export default MarkerCard;
