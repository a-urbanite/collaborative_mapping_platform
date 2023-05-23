import React from 'react'
import MapLoader from '../../components/Map/MapLoader'
import MarkerList from '../../components/MarkerList/MarkerList'
import UploadButton from '../../components/MarkerList/UploadButton/UploadButton'
import styles from './contribute.module.scss'
// import useModal2 from '../../components/Modal2/Modal2Hook'
import { useModal2 } from '../../components/Modal2/Modal2Context'

const Contribute = () => {
  const { openModalWithNameForm, openModalWithSpinner, openModalWithError } = useModal2();

  const handleButtonClick = async () => {
    const submittedName = await openModalWithError("asdsad");
    console.log("Submitted name:", submittedName);
  };

  return (
    <>
      <button onClick={handleButtonClick}>Open Modal</button>
      <p>Contribute</p>
      <div className={styles.homeContainer}>
      <MapLoader/>
      <div className={styles.sidebar}>
        <MarkerList />
        <UploadButton/>
      </div>
    </div>
    </>
  )
}

export default Contribute