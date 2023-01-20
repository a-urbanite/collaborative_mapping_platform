import React, { useState, useEffect } from "react";
import { createContext } from "react";

const DrawingContext = createContext();

const DrawingContextProvider = ({ children }) => {
  const [DrawnMarkers, setDrawnMarkers] = useState([]);

  const addDrawnMarker = (markerLayer) => {
    setDrawnMarkers((oldArray) => [...oldArray, markerLayer]);
  };

  const getDrawnMarkers = () => DrawnMarkers;

  return <DrawingContext.Provider value={{ addDrawnMarker, getDrawnMarkers }}>{children}</DrawingContext.Provider>;
};

const useDrawingContext = () => React.useContext(DrawingContext);

export { DrawingContextProvider, useDrawingContext };
