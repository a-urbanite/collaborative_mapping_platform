import React from "react";
import styles from "./uploadButton.module.scss";
import { useMarkerContext } from "../../MarkerContext";
import { useModal } from "../../Modal/ModalContext";
import { useFirestoreController } from "../../FirestoreController";
import { useRouter } from "next/router";

const UploadButton = () => {
  const { userMarkers } = useMarkerContext();
  const { uploadEdits } = useFirestoreController();
  const { openModalWithSpinner, closeModal, openModalWithError } = useModal();
  const router = useRouter();

  const uploadEditsWrapper = async () => {
    try {
      openModalWithSpinner("Uploading Edits");
      await uploadEdits(userMarkers)
      closeModal(500);
      router.push("/home");
    } catch (e: any) {
      console.error(e)
      openModalWithError(e.message);
    }
  };

  return (
    <button className={styles.button} onClick={() => uploadEditsWrapper()}>
      Upload my Edits
    </button>
  );
};

export default UploadButton;
