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
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState([]);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState([]);

  //called in Markerlist/Uploadbutton
  const uploadMarkers = async () => {

    const markersToUpload = userFirestoreMarkers.filter((marker) => marker.properties.operationIndicator !== null)
    console.log("markersToUpload: ", markersToUpload)
    if (markersToUpload) {
      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadLocations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(markersToUpload.map((obj) => convertToGeoJsonStr(obj))),
        });
        res = await res.json();
        return res;
      } catch (err) {
        console.error(err);
      }
    }
    // const newlyDrawnMarkers = userFirestoreMarkers.filter((marker) => marker.properties.operationIndicator === "drawn in current session")
    // console.log("newlydrawnmarkersarray: ", newlyDrawnMarkers)
    // if (newlyDrawnMarkers) {
    // }

    // const editedMarkers = userFirestoreMarkers.filter((marker) => marker.properties.operationIndicator === "updated in current session")
    // console.log("editedMarkers: ", editedMarkers)
    // if (editedMarkers) {
    // }
  };

  //called in home
  const fetchAllFirestoreMarkers = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let markers;
        // console.log("HOST URL: ", process.env.NEXT_PUBLIC_HOST_URL)
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
        markers = await res.json();
        // console.log("SERVERRES FROM MARKERFETCH: ", markers)
        markers.forEach((marker) => {
          marker.geometry.coordinates = deserializeGeoJsonCoords(marker);
          marker.properties.operationIndicator = null
        });
        setAllFirestoreMarkers(markers);
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };

  //called in myPlaces
  const filterUserFirestoreMarkers = (userObj) => {
    const markers = allFirestoreMarkers.filter((marker) => marker.properties.user.uid === userObj.uid);
    setUserFirestoreMarkers(markers);
  };

  return (
    <FireStoreContext.Provider
      value={{
        uploadMarkers,
        fetchAllFirestoreMarkers,
        filterUserFirestoreMarkers,
        allFirestoreMarkers,
        setAllFirestoreMarkers,
        userFirestoreMarkers,
        setUserFirestoreMarkers
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
