import React, { useState, useEffect } from "react";
// import { randomUUID } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { createContext } from "react";

const DrawingContext = createContext();

const DrawingContextProvider = ({ children }) => {
  const [drawnMarkers, setDrawnMarkers] = useState([]);

  const addDrawnMarker = (mapLayerObj) => {
    const marker = {
      id: uuidv4(),
      mapLayerObj: mapLayerObj,
      user: "mockupUser",
      dateCreated: Date.now(),
    };
    setDrawnMarkers((oldArray) => [...oldArray, marker]);
  };

  const editPopupContent = (currentMarker, title, text) => {
    currentMarker.popupContent = { title, text };

    const indexOfMarkerToChange = drawnMarkers.findIndex((marker) => marker.id == currentMarker.id);

    const updatedArray = drawnMarkers;
    updatedArray.splice(indexOfMarkerToChange, 1, currentMarker);
    setDrawnMarkers(updatedArray);

  };

  return (
    <DrawingContext.Provider value={{ addDrawnMarker, drawnMarkers, editPopupContent }}>
      {children}
    </DrawingContext.Provider>
  );
};

const useDrawingContext = () => React.useContext(DrawingContext);

export { DrawingContextProvider, useDrawingContext };
