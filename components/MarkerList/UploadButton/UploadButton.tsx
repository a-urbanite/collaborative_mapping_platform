import React from "react";
import styles from "./uploadButton.module.scss";
import { useFireStoreContext } from "../../FireStoreContext";
import { useModalContext } from "../../ModalContext";
import { useRouter } from "next/router";

const UploadButton = () => {
  const {
    uploadEditsToFirestore,
    userFirestoreMarkers,
    uploadEditsAJAX,
    setmarkersUpdated,
    filterMarkersToUpload,
  } = useFireStoreContext();
  const { openModalWithSpinner, closeModal, openModalWithError } = useModalContext();

  const router = useRouter();

  const uploadEdits = async () => {
    openModalWithSpinner("Uploading Edits");
    const markersToUpload = filterMarkersToUpload(userFirestoreMarkers)
    uploadEditsAJAX(markersToUpload)
      .then((res: any) => {
        setmarkersUpdated(true);
        console.log("response from upload", res);
        closeModal();
        router.push("/home");
      })
      .catch((err: any) => {
        console.error(err);
        openModalWithError();
      });
  };

  return (
    <button className={styles.button} onClick={() => uploadEdits()}>
      Upload my Edits
    </button>
  );
};

export default UploadButton;
