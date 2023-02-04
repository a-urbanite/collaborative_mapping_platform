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

//   function doSomethingLong(param) {

//     return new Promise(function(resolve, reject){
 
//         https.get('http://www.myurl.com?param=' + param, (resp) => {
//            let data = '';
 
//            // A chunk of data has been recieved.
//            resp.on('data', (chunk) => {
//                data += chunk;
//            });
 
//            // The whole response has been received. Print out the result.
//            resp.on('end', () => {
//                console.log("Call succeeded. Response: " + data);
//                resolve();
//            });
//        }).on("error", (err) => {
//            console.log("Call failed. Error: " + err.message);
//            reject(err);
//        });
//     });
//  }

  //called in home
  const fetchAllFirestoreMarkers = () => {

    return new Promise( async (resolve, reject) => {
      let markers;
      try {
        let res = await fetch(`http://localhost:3000/api/locations`);
        markers = await res.json();
        markers.forEach((marker) => {
          marker.geometry.coordinates = deserializeGeoJsonCoords(marker);
        });
        setAllFirestoreMarkers(markers);
        resolve()
      } catch (err) {
        console.error(err)
        reject(err)
      }

    })


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
