import React from "react";
import { createContext } from "react";
import {
  createNewGeojsonFromLayer,
  createUpdatedGeojsonFromLayer,
  createGeojsonMarkedForDeletionFromLayer,
  createGeojsonWithUpdatedPopup,
  fetchMarkersAJAX,
  uploadEditsAJAX,
  // filterUserMarkers,
  filterMarkersToUpload,
} from "./FireStoreContext_utils";

const FireStoreContext = createContext();

const FireStoreContextProvider = ({ children }) => {
  const [allFirestoreMarkers, setAllFirestoreMarkers] = React.useState(new Map());
  const [userFirestoreMarkers, setUserFirestoreMarkers] = React.useState(new Map());
  const [markersUpdated, setmarkersUpdated] = React.useState(false);
  const [initialFetch, setinitialFetch] = React.useState(true);

  const processEdits = (updatedLayerProp, operationIndicator, addprops) => {
    const updatedLayers = Array.isArray(updatedLayerProp) ? [...updatedLayerProp] : [updatedLayerProp]

    updatedLayers.forEach((updatedLayer) => {
      let geojson;

      switch (operationIndicator) {
        case "addMarker":
          geojson = createNewGeojsonFromLayer(updatedLayer, addprops.userObj);
          break;
        case "editMarker":
          geojson = createUpdatedGeojsonFromLayer(updatedLayer);
          break;
        case "deleteMarker":
          geojson = createGeojsonMarkedForDeletionFromLayer(updatedLayer);
          break;
        case "updatePopupContent":
          geojson = createGeojsonWithUpdatedPopup(updatedLayer, addprops.popupContent);
          break;
        }

      const key = geojson.properties.markerId;
      setUserFirestoreMarkers(new Map(userFirestoreMarkers.set(key, geojson)));
    })
  }

  const fetchAllMarkers = async () => {
    if (initialFetch || markersUpdated) {
      // console.log("fetchAllMarkers()");
      fetchMarkersAJAX()
        .then((markers) => {
          setmarkersUpdated(false);
          setinitialFetch(false);
          const markerMap = new Map();

          markers.forEach((marker) => {
            markerMap.set(marker.properties.markerId, marker);
          });

          setAllFirestoreMarkers(markerMap);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const uploadEdits = async () => {

    const markersToUploadArr = filterMarkersToUpload(userFirestoreMarkers)
    setmarkersUpdated(true); //cant be in then or it wouldnt trigger before router.push
    uploadEditsAJAX(markersToUploadArr)
      .then((res) => {
        console.log("server resp: ", res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const defineUserMarkers = (userObj) => {
    setUserFirestoreMarkers(
      new Map([...allFirestoreMarkers].filter(([k, v]) => userObj.uid === v.properties.user.uid))
    );
  };

  const attachMapLayerObjToMarkerInHashmap = (geojson, layer, hashmap) => {
    const key = geojson.properties.markerId;
    const updatedMarker = hashmap.get(key);
    updatedMarker.mapLayerObj = layer;
    hashmap.set(key, updatedMarker);
  };

  const generatePopupContent = (marker) => {
    const props = marker.properties;
    return `
        <h2>${props.popupContent.title}</h2>
        <p>${props.popupContent.text}</p>
        <div style="display: flex">
          <p>by: ${props.user.name}</p>
          <p>@ ${props.dateUpdated ? props.dateUpdated : props.dateCreated}</p>
        </div>
      `;
  };


  return (
    <FireStoreContext.Provider
      value={{
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
        generatePopupContent,
        attachMapLayerObjToMarkerInHashmap,
        processEdits,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
