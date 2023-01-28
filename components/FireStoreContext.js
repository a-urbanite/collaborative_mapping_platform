import React, { useState, useEffect } from "react";
import { createContext } from "react";
import { dbRef } from "../firebase-config";
import { addDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState(null);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState(null);
  const router = useRouter();

  const convertToPrunedGeoJsonObj = (obj) => {
    const geoJsonObj = obj.mapLayerObj.toGeoJSON();
    geoJsonObj.properties = {
      id: obj.id,
      user: obj.user,
      dateCreated: obj.dateCreated,
      popupContent: obj.popupContent,
    };
    const geoJsonStr = JSON.stringify(geoJsonObj);
    return geoJsonStr;
  };

  //called in Markerlist/Uploadbutton
  const postDrawnmarkers = async (drawnMarkers) => {
    const response = await fetch(`http://localhost:3000/api/uploadLocations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drawnMarkers.map((obj) => convertToPrunedGeoJsonObj(obj))),
    });
    router.push('/home')
    // return response.json();
  };

  //called in home
  const fetchAllFirestoreMarkers = async () => {
    const res = await fetch(`http://localhost:3000/api/locations`);
    const markers = await res.json();
    setAllFirestoreMarkers(markers);
  };

  //called in myPlaces
  const filterUserFirestoreMarkers = (userObj) => {
    const markers = allFirestoreMarkers.filter((marker) => marker.properties.user.uid === userObj.uid);
    setUserFirestoreMarkers(markers);
  };

  return (
    <FireStoreContext.Provider
      value={{
        postDrawnmarkers,
        fetchAllFirestoreMarkers,
        filterUserFirestoreMarkers,
        allFirestoreMarkers,
        userFirestoreMarkers,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
