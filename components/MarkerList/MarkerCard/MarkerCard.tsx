import React from "react";
import { useModalContext } from "../../ModalContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker }: any) => {
  const { openModalWithMarkerPopupContentForm } = useModalContext();

  console.log("marker", marker)

  return (
    <li className={styles.listItem}>
      <div onMouseOver={() => marker.mapLayerObj.openPopup()} className={styles.container}>
        <div className={styles.textbar}>{`Feature: ${marker.properties.popupContent?.title || "unnamed"}`}</div>
        <div className={styles.buttonbar}>
          <button
            className={styles.button}
            onClick={() => openModalWithMarkerPopupContentForm(marker)}
          >
            Edit Content
          </button>
        </div>
      </div>
    </li>
  );
};

export default MarkerCard;
