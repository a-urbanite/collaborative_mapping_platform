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
    const id = geojson.properties.markerId
    setUserFirestoreMarkers(new Map(userFirestoreMarkers.set(id, geojson)))
  };

  const updateMarkersInLocalState = (e) => {
    const updatedMap = userFirestoreMarkers

    e.layers.getLayers().forEach((updatedLayer) => {
      // console.log("updatedLayer", updatedLayer)
      const key = updatedLayer.feature.properties.markerId
      const updatedGeojson = createUpdatedGeojsonFromLayer(updatedLayer)
      updatedMap.set(key, updatedGeojson)
    });

    setUserFirestoreMarkers(new Map(updatedMap))

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

    const updatedMap = userFirestoreMarkers

    e.layers.getLayers().forEach((updatedLayer) => {
      // console.log("updatedLayer", updatedLayer)
      const key = updatedLayer.feature.properties.markerId
      const updatedGeojson = createGeojsonMarkedForDeletionFromLayer(updatedLayer)
      updatedMap.set(key, updatedGeojson)
    });

    setUserFirestoreMarkers(new Map(updatedMap))



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
    
    
    const updatedMap = userFirestoreMarkers
    
    const key = currentMarker.properties.markerId
    
    const updatedGeojson = currentMarker
    updatedGeojson.properties.popupContent = { title, text };
    updatedGeojson.properties.dateUpdated = Date.now();
    updatedGeojson.properties.operationIndicator = "popup edited in current session";
    // const updatedGeojson = createUpdatedGeojsonFromLayer(updatedLayer)
    updatedMap.set(key, updatedGeojson)

    // e.layers.getLayers().forEach((updatedLayer) => {
      // console.log("updatedLayer", updatedLayer)
    // });

    setUserFirestoreMarkers(new Map(updatedMap))

    // const i = userFirestoreMarkers.findIndex(
    //   (marker) => marker.properties.markerId == currentMarker.properties.markerId
    // );
    // if (i === -1) {
    //   console.log("marker not found!");
    //   return;
    // }
    // const updatedArray = userFirestoreMarkers;
    // updatedArray.splice(i, 1, currentMarker);
    // setUserFirestoreMarkers(updatedArray);
    // setmarkersUpdated(true);
  };
//merger end

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

  const updateMarkerInHashmap = (geojson, layer, hashmap) => {
    const key = geojson.properties.markerId
    const updatedMarker = hashmap.get(key)
    updatedMarker.mapLayerObj = layer
    hashmap.set(key, updatedMarker)
  }

  // const filterMap = (m) {
  //   new Map([...m].filter(([k, v])=>k!=='a'))

  // }

  // function filter(map, pred) {
  //   const result = new Map();
  //   for (let [k, v] of map) {
  //     if (pred(k,v)) {
  //       result.set(k, v);
  //     }
  //   }
  //   return result;
  // }

  const uploadEdits = async () => {
    console.log("uploadEdits()");

    // const filteredMap = new Map()
    // allFirestoreMarkers.forEach((marker, key) => {
    //   if (marker.properties.operationIndicator !== null) {
    //     filteredMap.set(key, marker)
    //   }
    // })

    const markersToUploadArr = []
    userFirestoreMarkers.forEach((value, key) => {
      if (value.properties.operationIndicator !== null) {
        delete value.mapLayerObj
        markersToUploadArr.push(value)
      }
    })
    // .filter(([k, v])=>v.properties.operationIndicator !== null)

    console.log("asdsadsadas", markersToUploadArr);
    // const markersToUpload = filterMarkersToUpload(userFirestoreMarkers);
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

 

  // const highlightMarker2 = (currentMarker) => {
  //   currentMarker.mapLayerObj.openPopup();
  // };


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
        // highlightMarker2
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

const useFireStoreContext = () => React.useContext(FireStoreContext);

export { FireStoreContextProvider, useFireStoreContext };
