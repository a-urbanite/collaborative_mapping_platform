import React from 'react'
import MapLoader from '../../components/Map/MapLoader'
import MarkerList from '../../components/MarkerList/MarkerList'
import UploadButton from '../../components/MarkerList/UploadButton/UploadButton'
import styles from './contribute.module.scss'
import { useModal } from '../../components/Modal/ModalContext'

const Contribute = () => {
  const { openModalWithError } = useModal();

  const handleButtonClick = async () => {
    const submittedName = await openModalWithError("asdsad");
    console.log("Submitted name:", submittedName);
  };

  return (
    <>
      <button onClick={handleButtonClick}>Open Modal</button>
      <p>Contribute</p>
      <div className={styles.homeContainer}>
      <MapLoader markers={[]}/>
      <div className={styles.sidebar}>
        <MarkerList />
        <UploadButton/>
      </div>
    </div>
    </>
  )
}

export default Contribute