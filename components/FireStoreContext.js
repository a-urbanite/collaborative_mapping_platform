import React, { useState } from "react";
import { createContext } from "react";
import { useRouter } from "next/router";
import {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToPrunedGeoJsonStr,
} from "./FireStoreContext_utils";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState(null);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState(null);
  const router = useRouter();

  //called in Markerlist/Uploadbutton
  const postDrawnmarkers = async (drawnMarkers) => {
    const response = await fetch(`http://localhost:3000/api/uploadLocations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drawnMarkers.map((obj) => convertToPrunedGeoJsonStr(obj))),
    });
    router.push("/home");
  };

  //called in home
  const fetchAllFirestoreMarkers = async () => {
    const res = await fetch(`http://localhost:3000/api/locations`);
    const markers = await res.json();
    markers.forEach((marker) => {
      marker.geometry.coordinates = deserializeGeoJsonCoords(marker);
    });
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
