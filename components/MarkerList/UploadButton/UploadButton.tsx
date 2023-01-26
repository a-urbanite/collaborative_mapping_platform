import React from 'react'
import styles from './uploadButton.module.scss'
import { useMapContext } from '../../MapContext'

const UploadButton = () => {
  const { uploadDrawnMarkers } = useMapContext();

  return (
    <button className={styles.button} onClick={() => uploadDrawnMarkers()}>Upload my Features</button>
  )
}

export default UploadButton