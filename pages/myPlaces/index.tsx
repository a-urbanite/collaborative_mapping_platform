import React from 'react'
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from '../../components/MarkerList/MarkerList';
import UploadButton from '../../components/MarkerList/UploadButton/UploadButton';
import styles from './myPlaces.module.scss'
import { useRouter } from 'next/router';
import { auth } from "../../firebase-config";
import { useMarkerContext } from '../../components/MarkerContext';

const MyPlaces = () => {
  const router = useRouter();
  const { defineUserMarkers } = useMarkerContext();

  React.useEffect(() => {
    if (!auth.currentUser) {
      router.push('/home')
    }
    defineUserMarkers(auth.currentUser)
  }, [])

  return (
    <div className={styles.homeContainer}>
      <MapLoader/>
      <div className={styles.sidebar}>
        <MarkerList />
        <UploadButton/>
      </div>
    </div>
  )
}

export default MyPlaces