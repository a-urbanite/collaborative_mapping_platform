import React from 'react'
import styles from './uploadButton.module.scss'
import { useMapContext } from '../../MapContext'
import { useFireStoreContext } from "../../FireStoreContext";
import { useRouter } from 'next/router';

const UploadButton = () => {
  const { drawnMarkers } = useMapContext();
  const { postDrawnmarkers } = useFireStoreContext();
  const router = useRouter(); 

  const uploadDrawnMarkers = async () => {
    const response = await postDrawnmarkers(drawnMarkers)
    console.log(response)
    router.push("/home");
  }

  return (
    <button className={styles.button} onClick={() => uploadDrawnMarkers()}>Upload my Places</button>
  )
}

export default UploadButton