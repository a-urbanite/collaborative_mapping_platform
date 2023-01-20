import React, { useState, useEffect } from "react";
import { createContext } from "react";

const MapRefContext = createContext();

const MapRefContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = useState(null);

  return (
    <MapRefContext.Provider value={{ setMapRef, mapRef }}>{children}</MapRefContext.Provider>
  );
};

const useMapRefContext = () => React.useContext(MapRefContext);

export { MapRefContextProvider, useMapRefContext };
