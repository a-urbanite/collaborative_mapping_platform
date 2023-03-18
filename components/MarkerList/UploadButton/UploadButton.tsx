import React from 'react'
import styles from './uploadButton.module.scss'
import { useFireStoreContext } from "../../FireStoreContext";
import { useModalContext } from '../../ModalContext';
import { useRouter } from 'next/router';

const UploadButton = () => {
  const { uploadEditsToFirestore } = useFireStoreContext();
  const { openModalWithSpinner, closeModal } = useModalContext();

  const router = useRouter();

  const uploadDrawnMarkers = async () => {
    openModalWithSpinner()
    const response = await uploadEditsToFirestore()
    console.log("response from upload", response)
    closeModal()
    router.push("/home")
  }

  return (
    <button className={styles.button} onClick={() => uploadDrawnMarkers()}>Upload my Places</button>
  )
}

export default UploadButton