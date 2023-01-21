import React from 'react'
import styles from './uploadButton.module.scss'
import { useMapContext } from '../../MapContext'

const UploadButton = () => {
  const { drawnMarkers } = useMapContext(); 

  const uploadDrawnMarkers = () => {
    console.log("Markers to upload: ", drawnMarkers)
  }

  return (
    <button className={styles.button} onClick={() => uploadDrawnMarkers()}>Upload my Features</button>
  )
}

export default UploadButton