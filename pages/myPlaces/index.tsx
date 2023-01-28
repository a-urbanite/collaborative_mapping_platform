import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../components/UserContext'
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from '../../components/MarkerList/MarkerList';
import styles from './myPlaces.module.scss'
import { useFireStoreContext } from "../../components/FireStoreContext";
import { useRouter } from 'next/router';

const MyPlaces = () => {
  const { userObj } = useUserContext();
  const { filterUserFirestoreMarkers, userFirestoreMarkers } = useFireStoreContext();
  const router = useRouter();

  useEffect(() => {
    if (!userObj) {
      router.push('/home')
      return
    }
    filterUserFirestoreMarkers(userObj)
  }, [])

  return (
    <div className={styles.homeContainer}>
      <MapLoader markers={userFirestoreMarkers}/>
      <MarkerList />
    </div>
  )
}

export default MyPlaces