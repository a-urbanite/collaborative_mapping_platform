import React, { useState, useEffect } from "react";
import { createContext } from "react";
import { dbRef } from "../firebase-config";
import { addDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const router = useRouter();

  const uploadDrawnMarkers = (drawnMarkers) => {
    drawnMarkers.forEach((marker) => {
      const geoJsonObj = marker.mapLayerObj.toGeoJSON();
      geoJsonObj.properties = {
        id: marker.id,
        user: marker.user,
        dateCreated: marker.dateCreated,
        popupContent: marker.popupContent,
      }
      const geoJsonStr = JSON.stringify(geoJsonObj);
      addDoc(dbRef, { feature: geoJsonStr })
        .then((res) => {
          console.log(res)
          router.push('/teesat')
        })
        .catch((error) => {
        console.log("error happened!", error);
      });
    });
  };

  return (
    <FireStoreContext.Provider
      value={{
        uploadDrawnMarkers,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
