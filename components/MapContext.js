import React from "react";

const MapContext = React.createContext();

const MapContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = React.useState(null);

  const highlightMarker = (currentMarker) => {
    if (mapRef) {
      mapRef.eachLayer((layer) => {
        if (layer.markerId === currentMarker.properties.markerId) {
          layer.openPopup();
        }
      });
    }
  };

  return (
    <MapContext.Provider
      value={{
        setMapRef,
        mapRef,
        highlightMarker,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

const useMapContext = () => React.useContext(MapContext);

export { MapContextProvider, useMapContext };
