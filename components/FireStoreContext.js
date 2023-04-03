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

  // marker edit operations, could be merged into one?
  const addMarkerToLocalState = async (e, userObj) => {
    const geojson = createGeojsonFromLayer(e.layer, userObj);
    const id = geojson.properties.markerId;
    setUserFirestoreMarkers(new Map(userFirestoreMarkers.set(id, geojson)));
  };

  const updateMarkersInLocalState = (e) => {
    const updatedMap = userFirestoreMarkers;

    e.layers.getLayers().forEach((updatedLayer) => {
      // console.log("updatedLayer", updatedLayer)
      const key = updatedLayer.feature.properties.markerId;
      const updatedGeojson = createUpdatedGeojsonFromLayer(updatedLayer);
      updatedMap.set(key, updatedGeojson);
    });

    setUserFirestoreMarkers(new Map(updatedMap));

    // const updatedStateArr = userFirestoreMarkers;

    // updatedLayersArr.forEach((updatedLayer) => {
    // const i = updatedStateArr.findIndex(
    //   (marker) => marker.properties.markerId === updatedLayer.properties.markerId
    // );
    // updatedStateArr.splice(i, 1, updatedLayer);
    // });

    // setUserFirestoreMarkers((oldArray) => [...updatedStateArr]);
  };

  const deleteMarkersFromLocalState = (e) => {
    const updatedMap = userFirestoreMarkers;

    e.layers.getLayers().forEach((updatedLayer) => {
      // console.log("updatedLayer", updatedLayer)
      const key = updatedLayer.feature.properties.markerId;
      const updatedGeojson = createGeojsonMarkedForDeletionFromLayer(updatedLayer);
      updatedMap.set(key, updatedGeojson);
    });

    setUserFirestoreMarkers(new Map(updatedMap));

    // const deletedLayersArr = e.layers
    //   .getLayers()
    //   .map((layer) => createGeojsonMarkedForDeletionFromLayer(layer));
    // const updatedStateArr = userFirestoreMarkers;

    // deletedLayersArr.forEach((deletedLayer) => {
    //   const i = updatedStateArr.findIndex(
    //     (marker) => marker.properties.markerId === deletedLayer.properties.markerId
    //   );
    //   updatedStateArr.splice(i, 1, deletedLayer);
    // });

    // setUserFirestoreMarkers((oldArray) => [...updatedStateArr]);
  };

  const editMarkerPopupContent = (currentMarker, title, text) => {
    const updatedMap = userFirestoreMarkers;

    const key = currentMarker.properties.markerId;

    const updatedGeojson = currentMarker;
    updatedGeojson.properties.popupContent = { title, text };
    updatedGeojson.properties.dateUpdated = Date.now();
    updatedGeojson.properties.operationIndicator = "popup edited in current session";
    // const updatedGeojson = createUpdatedGeojsonFromLayer(updatedLayer)
    updatedMap.set(key, updatedGeojson);


    setUserFirestoreMarkers(new Map(updatedMap));
  };
  //merger end

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

  const updateMarkerInHashmap = (geojson, layer, hashmap) => {
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
        updateMarkerInHashmap,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
