import React from "react";
import styles from "./uploadButton.module.scss";
import { useMarkerContext } from "../../MarkerContext";
import { useModal2 } from "../../Modal2/Modal2Context";
import { useFirestoreController } from "../../FirestoreController";
import { useRouter } from "next/router";

const UploadButton = () => {
  const { userFirestoreMarkers } = useMarkerContext();
  const { uploadEdits } = useFirestoreController();
  const { openModalWithSpinner, closeModal, openModalWithError } = useModal2();
  const router = useRouter();

  const uploadEditsWrapper = async () => {
    try {
      openModalWithSpinner("Uploading Edits");
      await uploadEdits(userFirestoreMarkers)
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
