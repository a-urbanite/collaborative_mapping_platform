import React, { useState, useEffect } from "react";
import { createContext } from "react";
// import { v4 as uuidv4 } from "uuid";
import { useFireStoreContext } from "./FireStoreContext";
import { uuidv4 } from '@firebase/util';

const MapContext = createContext();

const MapContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = useState(null);
  // const [drawnMarkers, setDrawnMarkers] = useState([]);
  const { userFirestoreMarkers, setUserFirestoreMarkers } = useFireStoreContext();
  // const router = useRouter();

  // const addMarker = (mapLayerObj, userObj) => {
  //   const marker = {
  //     id: uuidv4(),
  //     mapLayerObj: mapLayerObj,
  //     user: {
  //       uid: userObj.uid,
  //       name: userObj.displayName,
  //     },
  //     dateCreated: Date.now(),
  //     popupContent: {},
  //   };
  //   setDrawnMarkers((oldArray) => [...oldArray, marker]);
  // };

  const addMarker = (e, userObj) => {

    //create a new geojson and attach stuff
    const geojson = e.layer.toGeoJSON()
    const uuid = uuidv4()
    e.layer.markerId = uuid
    geojson.properties = {
      markerId: uuid,
      user: {
        uid: userObj.uid,
        name: userObj.displayName,
      },
      dateCreated: Date.now(),
      popupContent: {title: "default title", text: "default text"},
      // operationIndicator: "drawn in current session",
      drawnInCurrentSession: true
    }

    //update local state 
    setUserFirestoreMarkers((oldArray) => [...oldArray, geojson]);
  }

  const editMarker = (e) => {

    //create an array of geojsons reflecting the changed layers
    const editedLayersArr = e.layers.getLayers().map((layer) => {
      // const markerId = layer.feature.properties.markerId
      const geojson = layer.toGeoJSON()
      geojson.properties = layer.feature.properties
      geojson.properties.dateUpdated = Date.now()
      // geojson.properties.operationIndicator = "updated in current session"
      geojson.properties.updatedInCurrentSession = true
      return geojson
    })

    // update the userFirestoreMarkers state with the edited layers
    const updatedStateArr = userFirestoreMarkers

    editedLayersArr.forEach((editedLayer) => {
      const currentMarkerId = editedLayer.properties.markerId
      const index = updatedStateArr.findIndex((marker) => marker.properties.markerId === currentMarkerId)
      updatedStateArr.splice(index, 1, editedLayer)
    });

    setUserFirestoreMarkers((oldArray) => [...updatedStateArr])
  
  }

  const editMarkerPopupContent = (currentMarker, title, text) => {
    currentMarker.popupContent = { title, text };

    const indexOfMarkerToChange = drawnMarkers.findIndex((marker) => marker.id == currentMarker.id);

    const updatedArray = drawnMarkers;
    updatedArray.splice(indexOfMarkerToChange, 1, currentMarker);
    setDrawnMarkers(updatedArray);

    currentMarker.mapLayerObj.bindPopup(`<h4>${title}</h4><p>${text}</p>`).openPopup();
  };

  // const deleteMarker = (currentMarker) => {
  //   if (confirm("Delete Marker?")) {

  //     setUserFirestoreMarkers(userFirestoreMarkers.filter((marker) => marker.properties.markerId !== currentMarker.properties.markerId));
  //   }
  // };

  // const markerHasComplexGeometry = (marker) => marker.properties.mapLayerObj.hasOwnProperty("_latlngs");

  const highlightMarker = (currentMarker) => {
    // console.log("highlightmarker func")
    // const markerId = currentMarker.properties.markerId
    if (mapRef) {
      // console.log("inside loop")
      mapRef.eachLayer(layer => {
        if (layer.markerId === currentMarker.properties.markerId) {
          layer.openPopup()
        }
      });
    }
  };

  return (
    <MapContext.Provider
      value={{
        setMapRef, mapRef,
        addMarker,
        editMarker,
        // drawnMarkers,
        // editMarkerPopupContent,
        // deleteMarker,
        highlightMarker,
        // drawnMarkers, setDrawnMarkers,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

const useMapContext = () => React.useContext(MapContext);

export { MapContextProvider, useMapContext };
