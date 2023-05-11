import React from 'react'
import MapLoader from '../../components/Map/MapLoader'
import MarkerList from '../../components/MarkerList/MarkerList'
import UploadButton from '../../components/MarkerList/UploadButton/UploadButton'
import styles from './contribute.module.scss'
import Modal2 from '../../components/Modal/Modal2'

const Contribute = () => {
  const modalRef = React.useRef(null as any);

  const handleButtonClick = async () => {
    const modalPromise = modalRef.current.openModal();
    const submittedName = await modalPromise;
    console.log("Submitted name:", submittedName);
    // Do something with the submitted name
  };

  return (
    <>
      <button onClick={handleButtonClick}>Open Modal</button>
      <Modal2 ref={modalRef} />
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