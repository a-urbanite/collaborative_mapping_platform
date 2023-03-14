import React, { useState, useEffect } from "react";
import { createContext } from "react";
// import { v4 as uuidv4 } from "uuid";
import { useFireStoreContext } from "./FireStoreContext";

const MapContext = createContext();

const MapContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = useState(null);
  // const [drawnMarkers, setDrawnMarkers] = useState([]);
  // const { userFirestoreMarkers, setUserFirestoreMarkers } = useFireStoreContext();
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

  // const editMarkerPopupContent = (currentMarker, title, text) => {
  //   currentMarker.popupContent = { title, text };

  //   const indexOfMarkerToChange = drawnMarkers.findIndex((marker) => marker.id == currentMarker.id);

  //   const updatedArray = drawnMarkers;
  //   updatedArray.splice(indexOfMarkerToChange, 1, currentMarker);
  //   setDrawnMarkers(updatedArray);

  //   currentMarker.mapLayerObj.bindPopup(`<h4>${title}</h4><p>${text}</p>`).openPopup();
  // };

  // const deleteMarker = (currentMarker) => {
  //   if (confirm("Delete Marker?")) {

  //     setUserFirestoreMarkers(userFirestoreMarkers.filter((marker) => marker.properties.markerId !== currentMarker.properties.markerId));
  //   }
  // };

  // const markerHasComplexGeometry = (marker) => marker.properties.mapLayerObj.hasOwnProperty("_latlngs");

  const highlightMarker = (currentMarker) => {
    // const markerId = currentMarker.properties.markerId
    if (mapRef) {
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
        // setMapRef, mapRef,
        // addMarker,
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
