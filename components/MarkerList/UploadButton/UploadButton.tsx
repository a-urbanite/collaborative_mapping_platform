import React from 'react'
import styles from './uploadButton.module.scss'
import { useMapContext } from '../../MapContext'
import { useFireStoreContext } from "../../FireStoreContext";

const UploadButton = () => {
  const { drawnMarkers } = useMapContext();
  const { uploadDrawnMarkers, postDrawnmarkers } = useFireStoreContext();

  return (
    <button className={styles.button} onClick={() => postDrawnmarkers(drawnMarkers)}>Upload my Features</button>
  )
}

export default UploadButton