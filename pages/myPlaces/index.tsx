import React from 'react'
import { useUserContext } from '../../components/UserContext'
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from '../../components/MarkerList/MarkerList';
import styles from './myPlaces.module.scss'
import { useRouter } from 'next/router';

const MyPlaces = () => {
  const { userObj } = useUserContext();
  const router = useRouter();

  React.useEffect(() => {
    if (!userObj) {
      router.push('/home')
      return
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