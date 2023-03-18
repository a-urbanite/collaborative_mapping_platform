import React, { useState } from "react";
import { createContext } from "react";
import {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToFirestoreCompatibleGeojson,
  createGeojsonFromLayer,
  createUpdatedGeojsonFromLayer
} from "./FireStoreContext_utils";
import { deleteDoc, doc } from "firebase/firestore";
import { collRef, firestore } from "../firebase-config";
import { uuidv4 } from '@firebase/util';
import { addDoc, getDoc, getDocs, where, updateDoc, query } from 'firebase/firestore';
// import { collRef } from '../../firebase-config';

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState([]);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState([]);

  const addMarkerToLocalState = async (layer, userObj) => {
    const geojson = createGeojsonFromLayer(layer, userObj)
    // await addDoc(collRef, convertToFirestoreCompatibleGeojson(geojson));
    setUserFirestoreMarkers((oldArray) => [...oldArray, geojson]);
  }

  const updateMarkerInLocalState = (e) => {
    const editedLayersArr = e.layers.getLayers().map((layer) => createUpdatedGeojsonFromLayer(layer))
    const updatedStateArr = userFirestoreMarkers

    editedLayersArr.forEach((editedLayer) => {
      const i = updatedStateArr.findIndex((marker) => marker.properties.markerId === editedLayer.properties.markerId)
      updatedStateArr.splice(i, 1, editedLayer)
    });
    setUserFirestoreMarkers((oldArray) => [...updatedStateArr])
  }

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

  // const deleteMarkerFromLocalState = (e: any) => {

  //   const deletedLayersArr = e.layers.getLayers()
  //   const updatedStateArr = userFirestoreMarkers

  //   deletedLayersArr.forEach((deletedLayer: any) => {
  //     const currentMarkerId = deletedLayer.feature.properties.markerId
  //     const index = updatedStateArr.findIndex((marker: any) => marker.properties.markerId === currentMarkerId)
  //     if (index != -1) {
  //       updatedStateArr.splice(index, 1)
  //     }
  //   });

  //   setUserFirestoreMarkers((oldArray: any) => [...updatedStateArr])

  // }

  //called in Markerlist/Uploadbutton
  const uploadMarkers = async () => {
    const markersToUpload = userFirestoreMarkers.filter(
      (marker) => marker.properties.operationIndicator !== null
    );
    // console.log("markersToUpload: ", markersToUpload);
    if (markersToUpload) {
      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadLocations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(markersToUpload.map((obj) => JSON.stringify(convertToFirestoreCompatibleGeojson(obj)))),
        });
        res = await res.json();
        return res;
      } catch (err) {
        console.error(err);
      }
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
    console.log("fetchAllFirestoreMarkers()")
    return new Promise(async (resolve, reject) => {
      try {
        let markers;
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
        markers = await res.json();
        markers.forEach((marker) => marker.geometry.coordinates = deserializeGeoJsonCoords(marker));
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
        addMarkerToLocalState,
        updateMarkerInLocalState,
        uploadMarkers,
        fetchAllFirestoreMarkers,
        filterUserFirestoreMarkers,
        allFirestoreMarkers,
        setAllFirestoreMarkers,
        userFirestoreMarkers,
        setUserFirestoreMarkers,
        deleteMarker,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
