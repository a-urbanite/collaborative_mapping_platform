import React from "react";
import { useMapContext } from "../../MapContext";
import { useModalContext } from "../../ModalContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker }: any) => {
  const { deleteMarker, highlightMarker } = useMapContext();
  const { activateMarkerPopupContentFormModal } = useModalContext();

  return (
    <li className={styles.listItem}>
      <div onMouseOver={() => highlightMarker(marker)} className={styles.container}>
        <div className={styles.textbar}>{`Feature: ${marker.popupContent ? marker.popupContent.title : "unnamed"}`}</div>
        <div className={styles.buttonbar}>
          <button
            className={styles.button}
            onClick={() => deleteMarker(marker)}
          >
            Delete
          </button>
          <button
            className={styles.button}
            onClick={() => activateMarkerPopupContentFormModal(marker)}
          >
            Edit Content
          </button>
        </div>
      </div>
    </li>
  );
};

export default MarkerCard;
