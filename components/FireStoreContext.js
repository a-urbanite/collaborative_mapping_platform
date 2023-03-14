import React, { useState } from "react";
import { createContext } from "react";
import {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToGeoJsonStr,
} from "./FireStoreContext_utils";
import { deleteDoc, doc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase-config";
import { collRef } from "../firebase-config";

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



  const getAllMarkers = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await getDocs(collRef);
        let markers = resp.docs.map((doc) => {
            const feature = doc.data()
            feature.properties.firebaseDocID = doc.id
            return feature
        })
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
  }



  //called in myPlaces
  const filterUserFirestoreMarkers = (userObj) => {
    const markers = allFirestoreMarkers.filter((marker) => marker.properties.user.uid === userObj.uid);
    setUserFirestoreMarkers(markers);
  };

  return (
    <FireStoreContext.Provider
      value={{
        uploadMarkers,
        // fetchAllFirestoreMarkers, 
        getAllMarkers,
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
