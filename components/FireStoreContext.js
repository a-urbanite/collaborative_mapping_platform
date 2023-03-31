import React from "react";
import { createContext } from "react";
import {
  createGeojsonFromLayer,
  createUpdatedGeojsonFromLayer,
  createGeojsonMarkedForDeletionFromLayer,
  fetchMarkersAJAX,
  uploadEditsAJAX,
  // filterUserMarkers,
  filterMarkersToUpload,
} from "./FireStoreContext_utils";
// import * as L from "leaflet";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  // const [fetchedMarkersArr, setfetchedMarkersArr] = React.useState(new Map())
  const [allFirestoreMarkers, setAllFirestoreMarkers] = React.useState(new Map());
  const [userFirestoreMarkers, setUserFirestoreMarkers] = React.useState(new Map());
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

  const fetchAllMarkers = async () => {
    if (initialFetch || markersUpdated) {
      console.log("fetchAllMarkers()");
      fetchMarkersAJAX()
        .then((markers) => {
          setmarkersUpdated(false);
          setinitialFetch(false);
          const markerMap = new Map();

          markers.forEach(marker => {
            markerMap.set(marker.properties.markerId, marker)
          });

          setAllFirestoreMarkers(markerMap);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const updateMarkerInHashmap = (geojson, layer) => {
    const key = geojson.properties.markerId
    const updatedMarker = allFirestoreMarkers.get(key)
    updatedMarker.mapLayerObj = layer
    allFirestoreMarkers.set(key, updatedMarker)
  }

  const uploadEdits = async () => {
    console.log("uploadEdits()");
    const markersToUpload = filterMarkersToUpload(userFirestoreMarkers);
    setmarkersUpdated(true); //cant be in then or it wouldnt trigger before router.push
    uploadEditsAJAX(markersToUpload)
      .then((res) => {
        console.log("server resp: ", res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const defineUserMarkers = (userObj) => {
    // console.log("defineUserMarkers()");
    // console.log("USEROBJ in FUNC", userObj.uid)
    // const userMarkers = filterUserMarkers(allFirestoreMarkers, userObj);

    const filteredMap = new Map()
    allFirestoreMarkers.forEach((marker, key) => {
      if (userObj.uid === marker.properties.user.uid) {
        filteredMap.set(key, marker)
      }
    })

    setUserFirestoreMarkers(filteredMap);
  };

  const generatePopupContent = (marker) => {
    const props = marker.properties
    return `
        <h2>${props.popupContent.title}</h2>
        <p>${props.popupContent.text}</p>
        <div style="display: flex">
          <p>by: ${props.user.name}</p>
          <p>@ ${
            props.dateUpdated ? props.dateUpdated : props.dateCreated
          }</p>
        </div>
      `;
  };

  const editMarkerPopupContent = (currentMarker, title, text) => {
    currentMarker.properties.popupContent = { title, text };
    currentMarker.properties.dateUpdated = Date.now();
    currentMarker.properties.operationIndicator = "popup edited in current session";

    const i = userFirestoreMarkers.findIndex(
      (marker) => marker.properties.markerId == currentMarker.properties.markerId
    );
    if (i === -1) {
      console.log("marker not found!");
      return;
    }
    const updatedArray = userFirestoreMarkers;
    updatedArray.splice(i, 1, currentMarker);
    setUserFirestoreMarkers(updatedArray);
    setmarkersUpdated(true);
  };

  const highlightMarker2 = (currentMarker) => {
    currentMarker.mapLayerObj.openPopup();
  };


  return (
    <FireStoreContext.Provider
      value={{
        addMarkerToLocalState,
        updateMarkersInLocalState,
        deleteMarkersFromLocalState,
        allFirestoreMarkers,
        setAllFirestoreMarkers,
        userFirestoreMarkers,
        setUserFirestoreMarkers,
        markersUpdated,
        setmarkersUpdated,
        initialFetch,
        setinitialFetch,
        fetchAllMarkers,
        uploadEdits,
        defineUserMarkers,
        editMarkerPopupContent,
        generatePopupContent,
        // fetchedMarkersArr
        updateMarkerInHashmap,
        highlightMarker2
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
