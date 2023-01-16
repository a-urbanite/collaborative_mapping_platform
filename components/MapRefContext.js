import React, { useState, useEffect } from "react";
import { createContext } from "react";

const MapRefContext = createContext();

const MapRefContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = useState(null);

  const setMapInstance = () => {
    return setMapRef;
  };

  const getMapInstance = () => {
    return mapRef;
  };

  return (
    <MapRefContext.Provider value={{ setMapInstance, getMapInstance }}>{children}</MapRefContext.Provider>
  );
};

const useMapRefContext = () => React.useContext(MapRefContext);

export { MapRefContextProvider, useMapRefContext };
