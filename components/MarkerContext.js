import React from "react";
import { createContext } from "react";
import {
  createNewGeojsonFromLayer,
  createUpdatedGeojsonFromLayer,
  createGeojsonMarkedForDeletionFromLayer,
  createGeojsonWithUpdatedPopup
} from "./MarkerContext_utils";

const MarkerContext = createContext();

const MarkerContextProvider = ({ children }) => {
  const [allMarkers, setAllMarkers] = React.useState(new Map());
  const [userMarkers, setUserMarkers] = React.useState(new Map());

  const processEdits = (updatedLayerProp, addprops) => {
    const updatedLayers = Array.isArray(updatedLayerProp) ? [...updatedLayerProp] : [updatedLayerProp]

    updatedLayers.forEach((updatedLayer) => {
      let geojson;

      switch (addprops.operation) {
        case "addMarker":
          geojson = createNewGeojsonFromLayer(updatedLayer, addprops.userObj);
          break;
        case "editMarker":
          geojson = createUpdatedGeojsonFromLayer(updatedLayer);
          break;
        case "deleteMarker":
          geojson = createGeojsonMarkedForDeletionFromLayer(updatedLayer);
          break;
        case "updatePopupContent":
          geojson = createGeojsonWithUpdatedPopup(updatedLayer, addprops.popupContent);
          break;
        }

      const key = geojson.properties.markerId;
      setUserMarkers(new Map(userMarkers.set(key, geojson)));
    })
  }

  const defineUserMarkers = (markerMap, userObj) => {
    setUserMarkers(
      new Map([...markerMap].filter(([k, v]) => userObj.uid === v.properties.user.uid))
    );
  };

  const attachMapLayerObjToMarkerInHashmap = (geojson, layer, hashmap) => {
    const key = geojson.properties.markerId;
    const updatedMarker = hashmap.get(key);
    updatedMarker.mapLayerObj = layer;
    hashmap.set(key, updatedMarker);
  };

  const generatePopupContent = (marker) => {
    // console.log("INSIDE GENERATEPOPUPCONTENT")
    const props = marker.properties;
    return `
        <h2>${props.popupContent.title}</h2>
        <p>${props.popupContent.text}</p>
        <div style="display: flex">
          <p>by: ${props.user.name}</p>
          <p>@ ${props.dateUpdated ? props.dateUpdated : props.dateCreated}</p>
        </div>
      `;
  };

  const highlightMarkerCard = (e) => {
    console.log("Marker Clicked!")
    console.log(e.target.feature.properties.markerId)
  }


  return (
    <MarkerContext.Provider
      value={{
        allMarkers,
        setAllMarkers,
        userMarkers,
        setUserMarkers,
        defineUserMarkers,
        generatePopupContent,
        attachMapLayerObjToMarkerInHashmap,
        processEdits,
        highlightMarkerCard
      }}
    >
      {children}
    </MarkerContext.Provider>
  );
};

const useMarkerContext = () => React.useContext(MarkerContext);

export { MarkerContextProvider, useMarkerContext };
