import React, { useState } from "react";
import { createContext } from "react";
import {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToGeoJsonStr,
} from "./FireStoreContext_utils";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState(null);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState(null);

  //called in Markerlist/Uploadbutton
  const postDrawnmarkers = async (drawnMarkers) => {
    try {
      let res = await fetch(`http://localhost:3000/api/uploadLocations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(drawnMarkers.map((obj) => convertToGeoJsonStr(obj))),
      });
      res = await res.json();
      return res;
    } catch (err) {
      console.error(err)
    }
  };

  //called in home
  const fetchAllFirestoreMarkers = async () => {
    let markers;
    try {
      let res = await fetch(`http://localhost:3000/api/locations`);
      markers = await res.json();
    } catch (err) {
      return console.error(err)
    }
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
