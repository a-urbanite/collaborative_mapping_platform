import React from "react";
import styles from "./uploadButton.module.scss";
import { useMarkerContext } from "../../Map/MarkerContext";
import { useModal } from "../../Modal/ModalContext";
import { useFirestoreController } from "../../FirestoreController/FirestoreController";
import { useRouter } from "next/router";
import { MarkerMap } from "../../Types";

const UploadButton = () => {
  const { userMarkers } = useMarkerContext();
  const { uploadEdits } = useFirestoreController();
  const { openModalWithSpinner, closeModal, openModalWithError } = useModal();
  const router = useRouter();

  const [allDeleted, setallDeleted] = React.useState(null as unknown as boolean)

  function checkAllDeleted(userMarkers: MarkerMap) {
    for (const entry of userMarkers.values()) {
      if (!entry.properties || entry.properties.operationIndicator !== "deleted in current session") {
        return false;
      }
    }
    return true;
  }

  React.useEffect(() => {
    const allDeleted = checkAllDeleted(userMarkers)
    setallDeleted(allDeleted)
  }, [userMarkers])
  

  const uploadEditsWrapper = async () => {
    try {
      openModalWithSpinner("Uploading Edits");
      await uploadEdits(userMarkers)
      await closeModal(1000);
      router.push("/home");
    } catch (e: any) {
      console.error(e)
      openModalWithError(e.message);
    }
  };


  if (userMarkers.size === 0 || allDeleted ) return <></>;
  
  return (
    <button className={styles.button} onClick={() => uploadEditsWrapper()}>
      Upload my Edits
    </button>
  );
};

export default UploadButton;
