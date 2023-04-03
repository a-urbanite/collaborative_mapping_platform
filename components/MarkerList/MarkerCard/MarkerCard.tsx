import React from "react";
// import { useMapContext } from "../../MapContext";
import { useModalContext } from "../../ModalContext";
// import { useFireStoreContext } from "../../FireStoreContext";
import styles from "./markerCard.module.scss";

const MarkerCard = ({ marker }: any) => {
  // console.log("sdfdsfdsfsdfsdf")
  // console.log("MARKER IN MARKERCARD", marker)
  // const { highlightMarker } = useMapContext();
  // const { highlightMarker2 } = useFireStoreContext();
  const { openModalWithMarkerPopupContentForm } = useModalContext();

  return (
    <li className={styles.listItem}>
      <div onMouseOver={() => marker.mapLayerObj.openPopup()} className={styles.container}>
        <div className={styles.textbar}>{`Feature: ${marker.popupContent?.title || "unnamed"}`}</div>
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
