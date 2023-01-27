import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../components/UserContext'
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from '../../components/MarkerList/MarkerList';
import styles from './myPlaces.module.scss'

const MyPlaces = () => {
  const { userObj } = useUserContext();
  const [myPlaces, setmyPlaces] = useState(null)

  useEffect( () => {
    const fetchMyLocations = async (uid: any) => {
      const res = await fetch(`http://localhost:3000/api/locations/${uid}`)
      const mylocations = await res.json()
      return mylocations
    }
    fetchMyLocations(userObj.uid)
      .then((mylocations) => {
        console.log("myplaces: ", mylocations)
        setmyPlaces(mylocations)})
  }, [])

  return (
    <div className={styles.homeContainer}>
      <MapLoader markers={myPlaces}/>
      <MarkerList />
    </div>
  )
}

export default MyPlaces