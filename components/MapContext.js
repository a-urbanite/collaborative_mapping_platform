import React, { useState, useEffect } from "react";
import { createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbRef } from "../firebase-config";
import { addDoc } from "firebase/firestore";

const MapContext = createContext();

const MapContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = useState(null);
  const [drawnMarkers, setDrawnMarkers] = useState([]);

  const addMarker = (mapLayerObj, userObj) => {
    const marker = {
      id: uuidv4(),
      mapLayerObj: mapLayerObj,
      user: {
        uid: userObj.uid,
        name: userObj.displayName,
      },
      dateCreated: Date.now(),
      popupContent: {},
    };
    setDrawnMarkers((oldArray) => [...oldArray, marker]);
  };

  const editMarkerPopupContent = (currentMarker, title, text) => {
    currentMarker.popupContent = { title, text };

    const indexOfMarkerToChange = drawnMarkers.findIndex((marker) => marker.id == currentMarker.id);

    const updatedArray = drawnMarkers;
    updatedArray.splice(indexOfMarkerToChange, 1, currentMarker);
    setDrawnMarkers(updatedArray);

    currentMarker.mapLayerObj.bindPopup(`<h4>${title}</h4><p>${text}</p>`).openPopup();
  };

  const deleteMarker = (currentMarker) => {
    if (confirm("Delete Marker?")) {
      mapRef.removeLayer(currentMarker.mapLayerObj);
      setDrawnMarkers(drawnMarkers.filter((marker) => marker.id !== currentMarker.id));
    }
  };

  const markerHasComplexGeometry = (marker) => marker.mapLayerObj.hasOwnProperty("_latlngs");

  const highlightMarker = (currentMarker) => {
    currentMarker.mapLayerObj.openPopup();
    if (markerHasComplexGeometry(currentMarker)) {
      return mapRef.panTo(currentMarker.mapLayerObj.getBounds().getCenter());
    }
    mapRef.panTo(currentMarker.mapLayerObj.getLatLng());
  };

  const uploadDrawnMarkers = () => {
    drawnMarkers.forEach((marker) => {
      // const readyToFlyObj = marker;
      const readyToFlyObj = {
        id: marker.id,
        user: marker.user,
        dateCreated: marker.dateCreated,
        popupContent: marker.popupContent,
      };
      delete readyToFlyObj.mapLayerObj
      const JsonStr = JSON.stringify(readyToFlyObj);
      addDoc(dbRef, { feature: JsonStr })
        .then((res) => console.log(res))
        .catch((error) => {
        console.log("error happened!", error);
      });
    });
  };

  return (
    <MapContext.Provider
      value={{
        setMapRef,
        mapRef,
        addMarker,
        drawnMarkers,
        editMarkerPopupContent,
        deleteMarker,
        highlightMarker,
        uploadDrawnMarkers,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

const useMapContext = () => React.useContext(MapContext);

export { MapContextProvider, useMapContext };
