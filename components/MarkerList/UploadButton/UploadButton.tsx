import React from "react";
import styles from "./uploadButton.module.scss";
import { useMarkerContext } from "../../MarkerContext";
import { useModalContext } from "../../ModalContext";
import { useFirestoreController } from "../../FirestoreController";
import { useRouter } from "next/router";

const UploadButton = () => {
  const { userFirestoreMarkers } = useMarkerContext();
  const { uploadEdits } = useFirestoreController();
  const { openModalWithSpinner, closeModal, openModalWithError } = useModalContext();
  const router = useRouter();

  const uploadEditsWrapper = async () => {
    openModalWithSpinner("Uploading Edits");
    uploadEdits(userFirestoreMarkers)
      .then(() => {
        closeModal(500);
        router.push("/home");
      })
      .catch((e: any) => {
        console.error(e)
        openModalWithError();
      });
  };

  return (
    <button className={styles.button} onClick={() => uploadEditsWrapper()}>
      Upload my Edits
    </button>
  );
};

export default UploadButton;
