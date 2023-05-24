import React from "react";
// import { useModalContext } from "../../ModalContext";
import styles from "./markerCard.module.scss";
import { useModal } from "../../Modal/ModalContext";
import { useMarkerContext } from "../../MarkerContext";

const MarkerCard = ({ marker }: any) => {
  // const { openModalWithMarkerPopupContentForm } = useModalContext();
  const { processEdits } = useMarkerContext();
  const { openModalWithPopupContentForm } = useModal();

  const processPopupContentEdits = async (marker: any) => {
    const updatedContents = await openModalWithPopupContentForm(marker);
    processEdits(marker, {
      operation: "updatePopupContent",
      popupContent: updatedContents,
    });
  };

  return (
    <li className={styles.listItem}>
      <div onMouseOver={() => marker.mapLayerObj.openPopup()} className={styles.container}>
        <div className={styles.textbar}>{`Feature: ${
          marker.properties.popupContent?.title || "unnamed"
        }`}</div>
        <div className={styles.buttonbar}>
          <button className={styles.button} onClick={() => processPopupContentEdits(marker)}>
            Edit Content
          </button>
        </div>
      </div>
    </li>
  );
};

export default MarkerCard;
