import React from 'react'
import styles from './uploadButton.module.scss'
import { useMapContext } from '../../MapContext'
import { useFireStoreContext } from "../../FireStoreContext";
import { useModalContext } from '../../ModalContext';
import { useRouter } from 'next/router';

const UploadButton = () => {
  const { drawnMarkers } = useMapContext();
  const { postDrawnmarkers } = useFireStoreContext();
  const { openModal, closeModal } = useModalContext();

  const router = useRouter(); 

  const uploadDrawnMarkers = async () => {
    openModal("test")
    const response = await postDrawnmarkers(drawnMarkers)
    console.log(response)
    closeModal()
    router.push("/home");
  }

  return (
    <button className={styles.button} onClick={() => uploadDrawnMarkers()}>Upload my Places</button>
  )
}

export default UploadButton