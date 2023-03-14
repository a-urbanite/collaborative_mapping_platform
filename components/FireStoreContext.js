import React, { useState } from "react";
import { createContext } from "react";
import {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToGeoJsonStr,
} from "./FireStoreContext_utils";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase-config";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState([]);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState([]);
  const [isUpdated, setisUpdated] = useState(false);
  // const [mapRef, setMapRef] = useState(null);

  //called in Markerlist/Uploadbutton
  const uploadMarkers = async () => {
    const markersToUpload = userFirestoreMarkers.filter(
      (marker) => marker.properties.operationIndicator !== null
    );
    console.log("markersToUpload: ", markersToUpload);
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
  };

  const deleteMarker = async (currentMarker) => {
    if (confirm("Delete Marker?")) {

      // await removeFirestoreMarker(currentMarker);
      await deleteDoc(doc(firestore, "markers1", currentMarker.properties.firebaseDocID))

      setUserFirestoreMarkers(
        userFirestoreMarkers.filter(
          (marker) => marker.properties.markerId !== currentMarker.properties.markerId
        )
      );
    }
  };



  // const removeFirestoreMarker = async (marker) => {
  //   console.log("MARKER", marker);
  //   try {
  //     let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/deleteLocation`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(marker),
  //     });
  //     res = await res.json();
  //     return res;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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
          marker.properties.operationIndicator = null;
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
        setUserFirestoreMarkers,
        isUpdated,
        setisUpdated,
        deleteMarker,
        // mapRef, setMapRef
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
