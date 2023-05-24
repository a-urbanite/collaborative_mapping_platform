import React from 'react'
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from '../../components/MarkerList/MarkerList';
import UploadButton from '../../components/MarkerList/UploadButton/UploadButton';
import styles from './myPlaces.module.scss'
import { useRouter } from 'next/router';
import { auth } from "../../firebase-config";
import { useMarkerContext } from '../../components/MarkerContext';
import { useFirestoreController } from '../../components/FirestoreController/FirestoreController';

const MyPlaces = () => {
  const router = useRouter();
  const { userMarkers, defineUserMarkers, allMarkers } = useMarkerContext();
  const { initialFetch, markersUpdated  } = useFirestoreController();

  React.useEffect(() => {
    console.log("MYPALCES initial render")
    if (!auth.currentUser) {
      router.push('/home')
    }
    console.log("initialFetch: ", initialFetch, ", markersUpdated: ", markersUpdated)
    defineUserMarkers(allMarkers, auth.currentUser)
  }, [])

  return (
    <div className={styles.homeContainer}>
      <MapLoader markers={userMarkers}/>
      <div className={styles.sidebar}>
        <MarkerList />
        <UploadButton/>
      </div>
    </div>
  )
}

export default MyPlaces