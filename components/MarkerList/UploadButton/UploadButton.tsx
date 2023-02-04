import React from 'react'
import styles from './uploadButton.module.scss'
import { useMapContext } from '../../MapContext'
import { useFireStoreContext } from "../../FireStoreContext";
import { useModalContext } from '../../ModalContext';
import { useRouter } from 'next/router';

const UploadButton = () => {
  const { drawnMarkers } = useMapContext();
  const { postDrawnmarkers } = useFireStoreContext();
  const { openModalWithSpinner, closeModal } = useModalContext();

  const router = useRouter();

  const uploadDrawnMarkers = async () => {
    openModalWithSpinner()
    const response = await postDrawnmarkers(drawnMarkers)
    closeModal(1000)
  }

  return (
    <button className={styles.button} onClick={() => uploadDrawnMarkers()}>Upload my Places</button>
  )
}

export default UploadButton