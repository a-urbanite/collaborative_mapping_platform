import React from "react";
import { useMapContext } from "../../MapContext";
import { useModalContext } from "../../ModalContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker, i }: any) => {
  const { mapRef, deleteMarker } = useMapContext();
  const { setModal } = useModalContext();

  const highlightMarker = () => {
    mapRef.panTo(marker.mapLayerObj.getLatLng());
  };

  const openFormModal = () => {
    setModal({ isOpen: true, context: "markerContentForm", currentMarker: marker });
  };

  const removeMarker = () => {
    if (confirm("Press a button!")) {
      mapRef.removeLayer(marker.mapLayerObj)
      deleteMarker(marker)
    }
  }

  return (
    <li className={styles.listItem}>
      <div onMouseOver={() => highlightMarker()} className={styles.container}>
        <div className={styles.textbar}>Feature {i + 1}</div>
        <div className={styles.buttonbar}>
          <button className={styles.button} onClick={() => removeMarker()}>Delete</button>
          <button className={styles.button} onClick={() => openFormModal()}>Edit Content</button>
        </div>
      </div>
    </li>
  );
};

export default MarkerCard;
