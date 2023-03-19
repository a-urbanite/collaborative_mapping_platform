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
  createGeojsonMarkedForDeletionFromLayer,
} from "./FireStoreContext_utils";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = React.useState([]);
  const [userFirestoreMarkers, setUserFirestoreMarkers] = React.useState([]);
  const [markersUpdated, setmarkersUpdated] = React.useState(false);
  const [initialFetch, setinitialFetch] = React.useState(true);

  const addMarkerToLocalState = async (e, userObj) => {
    const geojson = createGeojsonFromLayer(e.layer, userObj);
    setUserFirestoreMarkers((oldArray) => [...oldArray, geojson]);
  };

  const updateMarkersInLocalState = (e) => {
    const editedLayersArr = e.layers.getLayers().map((layer) => createUpdatedGeojsonFromLayer(layer));
    const updatedStateArr = userFirestoreMarkers;

    editedLayersArr.forEach((editedLayer) => {
      const i = updatedStateArr.findIndex(
        (marker) => marker.properties.markerId === editedLayer.properties.markerId
      );
      updatedStateArr.splice(i, 1, editedLayer);
    });

    setUserFirestoreMarkers((oldArray) => [...updatedStateArr]);
  };

  const deleteMarkersFromLocalState = (e) => {
    const deletedLayersArr = e.layers
      .getLayers()
      .map((layer) => createGeojsonMarkedForDeletionFromLayer(layer));
    const updatedStateArr = userFirestoreMarkers;

    deletedLayersArr.forEach((deletedLayer) => {
      const i = updatedStateArr.findIndex(
        (marker) => marker.properties.markerId === deletedLayer.properties.markerId
      );
      updatedStateArr.splice(i, 1, deletedLayer);
    });

    setUserFirestoreMarkers((oldArray) => [...updatedStateArr]);
  };

  const uploadEditsAJAX = (markersToUpload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadEdits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            markersToUpload.map((obj) => JSON.stringify(convertToFirestoreCompatibleGeojson(obj)))
          ),
        });
        res = await res.json();
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  };

  const fetchMarkersAJAX = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let markers;
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
        markers = await res.json();
        markers.forEach((marker) => (marker.geometry.coordinates = deserializeGeoJsonCoords(marker)));
        resolve(markers);
      } catch (err) {
        reject(err);
      }
    });
  };

  const filterMarkersToUpload = (markerArray) => {
    return markerArray.filter((marker) => marker.properties.operationIndicator !== null);
  };

  const filterUserMarkers = (markerArray, userObj) => {
    return markerArray.filter((marker) => marker.properties.user.uid === userObj.uid);
  };

  return (
    <FireStoreContext.Provider
      value={{
        addMarkerToLocalState, updateMarkersInLocalState, deleteMarkersFromLocalState,
        fetchMarkersAJAX, uploadEditsAJAX,
        filterUserMarkers, filterMarkersToUpload,
        allFirestoreMarkers, setAllFirestoreMarkers,
        userFirestoreMarkers, setUserFirestoreMarkers,
        markersUpdated, setmarkersUpdated,
        initialFetch, setinitialFetch,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
