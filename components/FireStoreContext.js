import React, { useState } from "react";
import { createContext } from "react";
import {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
} from "./FireStoreContext_utils";
import { deleteDoc, doc, getDocs, addDoc, query, where, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase-config";
import { collRef } from "../firebase-config";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState([]);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState([]);

  const addMarkersToFirestore = () => {
    userFirestoreMarkers.forEach( async (marker) => {
      if (marker.properties.drawnInCurrentSession) {
        marker.properties.drawnInCurrentSession === false
        marker.geometry.coordinates = serializeGeoJsonCoords(marker);
        await addDoc(collRef, marker);

        // setUserFirestoreMarkers(
        //   userFirestoreMarkers.filter(
        //     (marker) => marker.properties.markerId !== currentMarker.properties.markerId
        //   )
        // );
      }
    })
  };

  const updateMarkerAtFirestore = () => {
    userFirestoreMarkers.forEach( async (marker) => {
      if (marker.properties.updatedInCurrentSession) {
        marker.properties.updatedInCurrentSession === false
        const markerId = marker.properties.markerId
        const q = query(collRef, where('properties.markerId', '==', markerId));
        const querySnapshot = await getDocs(q)
        const docRef = querySnapshot.docs[0].ref;
        marker.geometry.coordinates = serializeGeoJsonCoords(marker);
        await updateDoc(docRef, marker)
      }
    })
  }

  const deleteMarkerFromFirestore = async (currentMarker) => {
    if (confirm("Delete Marker?")) {
      await deleteDoc(doc(firestore, "markers1", currentMarker.properties.firebaseDocID));

      setUserFirestoreMarkers(
        userFirestoreMarkers.filter(
          (marker) => marker.properties.markerId !== currentMarker.properties.markerId
        )
      );
    }
  };

  const getAllMarkersFromFirestore = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await getDocs(collRef);
        let markers = resp.docs.map((doc) => {
          const feature = doc.data();
          feature.properties.firebaseDocID = doc.id;
          return feature;
        });
        markers.forEach((marker) => {
          marker.geometry.coordinates = deserializeGeoJsonCoords(marker);
          marker.properties.drawnInCurrentSession === false
          marker.properties.updatedInCurrentSession === false
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
        // uploadMarkers,
        // fetchAllFirestoreMarkers,
        getAllMarkersFromFirestore,
        filterUserFirestoreMarkers,
        allFirestoreMarkers, setAllFirestoreMarkers,
        userFirestoreMarkers, setUserFirestoreMarkers,
        addMarkersToFirestore,
        updateMarkerAtFirestore,
        deleteMarkerFromFirestore,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
