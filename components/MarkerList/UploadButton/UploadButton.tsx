import React from "react";
import styles from "./uploadButton.module.scss";
import { useFireStoreContext } from "../../FireStoreContext";
import { useModalContext } from "../../ModalContext";
import { useRouter } from "next/router";

const UploadButton = () => {
  const { uploadEdits } = useFireStoreContext();
  const { openModalWithSpinner, closeModal, openModalWithError } = useModalContext();
  const router = useRouter();

  const uploadEditsWrapper = async () => {
    openModalWithSpinner("Uploading Edits");
    uploadEdits()
      .then(() => {
        closeModal(500);
        router.push("/home");
      })
      .catch(() => {
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
