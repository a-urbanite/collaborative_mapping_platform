import React, { useState, useEffect } from "react";
import { createContext } from "react";

const DrawingContext = createContext();

const DrawingContextProvider = ({ children }) => {
  const [DrawnMarkers, setDrawnMarkers] = useState([]);

  // useEffect(() => {
  //   console.log("DrawnmarkersState: ", DrawnMarkers)
  // }, [DrawnMarkers])

  const addDrawnMarker = (markerLayer) => {
    // console.log("addDrawnMarker functin triggered");
    // console.log("Marker to add: ", markerGeoJSON)
    // console.log("preexisting markers in state: ", DrawnMarkers)
    setDrawnMarkers((oldArray) => [...oldArray, markerLayer]);
  };

  const getDrawnMarkers = () => DrawnMarkers;

  return <DrawingContext.Provider value={{ addDrawnMarker, getDrawnMarkers }}>{children}</DrawingContext.Provider>;
};

const useDrawingContext = () => React.useContext(DrawingContext);

export { DrawingContextProvider, useDrawingContext };
