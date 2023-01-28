import React, { useState } from "react";
import { createContext } from "react";
import { useRouter } from "next/router";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = useState(null);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = useState(null);
  const router = useRouter();

  const serializeCoordsArr = (arrayOfArrays) => {
    // let arrayOfArrays = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    let obj = arrayOfArrays.reduce((acc, curr, index) => {
        acc[index] = curr;
        return acc;
    }, {});
    // console.log(obj);
    return obj
  }

  const deSerializeCoordsArr = (obj) => {
    let array = [];
    for (let key in obj) {
        array.push(obj[key]);
    }
    return array;
  }

  const convertToPrunedGeoJsonObj = (obj) => {
    const geoJsonObj = obj.mapLayerObj.toGeoJSON();
    geoJsonObj.properties = {
      id: obj.id,
      user: obj.user,
      dateCreated: obj.dateCreated,
      popupContent: obj.popupContent,
    };
    geoJsonObj.geometry.coordinates = serializeCoordsArr(geoJsonObj.geometry.coordinates)
    // console.log("GEOJSONOBJ ready to fly: ", geoJsonObj)
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
  };

  //called in home
  const fetchAllFirestoreMarkers = async () => {
    const res = await fetch(`http://localhost:3000/api/locations`);
    const markers = await res.json();
    markers.forEach((marker) => {marker.geometry.coordinates = deSerializeCoordsArr(marker.geometry.coordinates)})
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
