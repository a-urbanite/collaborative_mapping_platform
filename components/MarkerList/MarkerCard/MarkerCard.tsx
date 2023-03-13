import React from "react";
import { useMapContext } from "../../MapContext";
import { useModalContext } from "../../ModalContext";
import { useFireStoreContext } from "../../FireStoreContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker }: any) => {
  const { highlightMarker } = useMapContext();
  const { openModalWithMarkerPopupContentForm } = useModalContext();
  const { deleteMarker } = useFireStoreContext();


  return (
    <li className={styles.listItem}>
      <div onMouseOver={() => highlightMarker(marker)} className={styles.container}>
        <div className={styles.textbar}>{`Feature: ${marker.popupContent?.title || "unnamed"}`}</div>
        <div className={styles.buttonbar}>
          <button
            className={styles.button}
            onClick={() => deleteMarker(marker) }
          >
            Delete
          </button>
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
