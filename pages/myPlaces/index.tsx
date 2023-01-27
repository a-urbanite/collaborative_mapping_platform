import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../components/UserContext'
import MapLoader from "../../components/Map/MapLoader";

const MyPlaces = () => {
  // const { isAuth } = useUserContext();
  const { userObj } = useUserContext();
  const [myPlaces, setmyPlaces] = useState(null)

  useEffect( () => {
    const fetchMyLocations = async (uid: any) => {
      // console.log("userObj in fetch: ", uid)
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
    <div>
      <MapLoader markers={myPlaces}/>
    </div>
  )
}

export default MyPlaces