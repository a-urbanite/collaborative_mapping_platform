import React, { useState, useEffect } from "react";
import { createContext } from "react";
import { v4 as uuidv4 } from "uuid";

const MapContext = createContext();

const MapContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = useState(null);
  const [drawnMarkers, setDrawnMarkers] = useState([]);

  const addMarker = (mapLayerObj) => {
    const marker = {
      id: uuidv4(),
      mapLayerObj: mapLayerObj,
      user: "mockupUser",
      dateCreated: Date.now(),
      popupContent: {}
    };
    setDrawnMarkers((oldArray) => [...oldArray, marker]);
  };

  const editMarkerPopupContent = (currentMarker, title, text) => {
    currentMarker.popupContent = { title, text };

    const indexOfMarkerToChange = drawnMarkers.findIndex((marker) => marker.id == currentMarker.id);

    const updatedArray = drawnMarkers;
    updatedArray.splice(indexOfMarkerToChange, 1, currentMarker);
    setDrawnMarkers(updatedArray);

    currentMarker.mapLayerObj.bindPopup(`<h4>${title}</h4><p>${text}</p>`).openPopup()
  };

  const deleteMarker = (currentMarker) => {
    if (confirm("Delete Marker?")) {
      mapRef.removeLayer(currentMarker.mapLayerObj)
      setDrawnMarkers(drawnMarkers.filter((marker) => marker.id !== currentMarker.id));
    }
  };

  const highlightMarker = (currentMarker) => {
    currentMarker.mapLayerObj.openPopup()
    mapRef.panTo(currentMarker.mapLayerObj.getLatLng());
  }

  return (
    <MapContext.Provider
      value={{ setMapRef, mapRef, addMarker, drawnMarkers, editMarkerPopupContent, deleteMarker, highlightMarker }}
    >
      {children}
    </MapContext.Provider>
  );
};

const useMapContext = () => React.useContext(MapContext);

export { MapContextProvider, useMapContext };
