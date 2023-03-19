import React from "react";
import { createContext } from "react";
import {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToFirestoreCompatibleGeojson,
  createGeojsonFromLayer,
  createUpdatedGeojsonFromLayer,
  createGeojsonMarkedForDeletionFromLayer
} from "./FireStoreContext_utils";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = React.useState([]);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = React.useState([]);
  const [markersUpdated, setmarkersUpdated] = React.useState(false)
  const [initialFetch, setinitialFetch] = React.useState(true)

  const addMarkerToLocalState = async (e, userObj) => {
    const geojson = createGeojsonFromLayer(e.layer, userObj)
    setUserFirestoreMarkers((oldArray) => [...oldArray, geojson]);
  }

  const updateMarkersInLocalState = (e) => {
    const editedLayersArr = e.layers.getLayers().map((layer) => createUpdatedGeojsonFromLayer(layer))
    const updatedStateArr = userFirestoreMarkers

    editedLayersArr.forEach((editedLayer) => {
      const i = updatedStateArr.findIndex((marker) => marker.properties.markerId === editedLayer.properties.markerId)
      updatedStateArr.splice(i, 1, editedLayer)
    });

    setUserFirestoreMarkers((oldArray) => [...updatedStateArr])
  }

  const deleteMarkersFromLocalState = (e) => {
    const deletedLayersArr = e.layers.getLayers().map((layer) => createGeojsonMarkedForDeletionFromLayer(layer))
    const updatedStateArr = userFirestoreMarkers

    deletedLayersArr.forEach((deletedLayer) => {
      const i = updatedStateArr.findIndex((marker) => marker.properties.markerId === deletedLayer.properties.markerId)
      updatedStateArr.splice(i, 1, deletedLayer)
    });

    setUserFirestoreMarkers((oldArray) => [...updatedStateArr])
  }

  //called in Markerlist/Uploadbutton
  const uploadEditsToFirestore = async () => {
    const markersToUpload = userFirestoreMarkers.filter(
      (marker) => marker.properties.operationIndicator !== null
    );
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
        setmarkersUpdated(true);
        return res;
      } catch (err) {
        console.error(err);
      }
    }
  };

  //called in home
  const fetchAllFirestoreMarkers = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let markers;
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
        markers = await res.json();
        markers.forEach((marker) => marker.geometry.coordinates = deserializeGeoJsonCoords(marker));
        resolve(markers);
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
        updateMarkersInLocalState,
        deleteMarkersFromLocalState,
        uploadEditsToFirestore,
        fetchAllFirestoreMarkers,
        filterUserFirestoreMarkers,
        allFirestoreMarkers,
        setAllFirestoreMarkers,
        userFirestoreMarkers,
        setUserFirestoreMarkers,
        markersUpdated, setmarkersUpdated,
        initialFetch, setinitialFetch
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
