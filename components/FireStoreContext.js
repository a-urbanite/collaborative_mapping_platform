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

  const uploadDrawnMarkers = (drawnMarkers) => {
    drawnMarkers.forEach((marker) => {
      const geoJsonObj = marker.mapLayerObj.toGeoJSON();
      geoJsonObj.properties = {
        id: marker.id,
        user: marker.user,
        dateCreated: marker.dateCreated,
        popupContent: marker.popupContent,
      };
      const geoJsonStr = JSON.stringify(geoJsonObj);
      addDoc(dbRef, { feature: geoJsonStr })
        .then((res) => {
          console.log(res);
          router.push("/teesat");
        })
        .catch((error) => {
          console.log("error happened!", error);
        });
    });
  };

  const fetchAllFirestoreMarkers = async () => {
    const res = await fetch(`http://localhost:3000/api/locations`);
    const markers = await res.json();
    setAllFirestoreMarkers(markers);
  };

  const fetchUserFirestoreMarkers = async (userObj) => {
    const res = await fetch(`http://localhost:3000/api/locations/${userObj.uid}`);
    const mylocations = await res.json();
    setUserFirestoreMarkers(mylocations);
  };

  const filterUserFirestoreMarkers = (userObj) => {
    const userlocations = allFirestoreMarkers.filter(
        (location) => location.properties.user.uid === userObj.uid
      );
      setUserFirestoreMarkers(userlocations)
  }

  return (
    <FireStoreContext.Provider
      value={{
        uploadDrawnMarkers,
        fetchAllFirestoreMarkers,
        fetchUserFirestoreMarkers,
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
