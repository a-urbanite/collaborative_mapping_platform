import React from 'react'
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from '../../components/MarkerList/MarkerList';
import styles from './myPlaces.module.scss'
import { useRouter } from 'next/router';
import { auth } from "../../firebase-config";

const MyPlaces = () => {
  const router = useRouter();

  React.useEffect(() => {
    if (!auth.currentUser) {
      router.push('/home')
    }
  }, [])

  return (
    <div className={styles.homeContainer}>
      <MapLoader/>
      <MarkerList />
    </div>
  )
}

export default MyPlaces