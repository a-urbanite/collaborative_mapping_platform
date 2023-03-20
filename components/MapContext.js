import React from "react";
import { useFireStoreContext } from "./FireStoreContext";

const MapContext = React.createContext();

const MapContextProvider = ({ children }) => {
  const [mapRef, setMapRef] = React.useState(null);
  const { userFirestoreMarkers, setUserFirestoreMarkers, setmarkersUpdated } = useFireStoreContext();


  // const editMarkerPopupContent = (currentMarker, title, text) => {
  //   currentMarker.properties.popupContent = { title, text };
  //   currentMarker.properties.dateUpdated = Date.now()
  //   currentMarker.properties.operationIndicator = "popup edited in current session"

  //   const i = userFirestoreMarkers.findIndex(
  //     (marker) => marker.properties.markerId == currentMarker.properties.markerId
  //   );
  //   if (i === -1) {
  //     console.log("marker not found!");
  //     return;
  //   }
  //   // console.log("indey of marker to change: ", i)
  //   const updatedArray = userFirestoreMarkers;
  //   updatedArray.splice(i, 1, currentMarker);
  //   setUserFirestoreMarkers(updatedArray);
  //   setmarkersUpdated(true);

  //   if (mapRef) {
  //     mapRef.eachLayer((layer) => {
  //       if (layer.markerId === currentMarker.properties.markerId) {
  //         layer.openPopup();
  //       }
  //     });
  //   }

  // };



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
        // addMarker,
        // drawnMarkers,
        // editMarkerPopupContent,
        // deleteMarker,
        highlightMarker,
        // drawnMarkers, setDrawnMarkers,
        // generatePopupContent,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

const useMapContext = () => React.useContext(MapContext);

export { MapContextProvider, useMapContext };
