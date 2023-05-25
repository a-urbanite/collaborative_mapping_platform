import React, { Dispatch, SetStateAction } from "react";
import { createContext } from "react";
import {
  createNewGeojsonFromLayer,
  createUpdatedGeojsonFromLayer,
  createGeojsonMarkedForDeletionFromLayer,
  createGeojsonWithUpdatedPopup
} from "./MarkerContext_utils";
import { FirestoreMarker, User, PopupContent, MarkerMap } from "./FirestoreController/Types";
import * as L from 'leaflet'

interface MarkerContextValue {
  allMarkers: MarkerMap;
  setAllMarkers: Dispatch<SetStateAction<Map<any, any>>>
  userMarkers: MarkerMap;
  setUserMarkers: Dispatch<SetStateAction<Map<any, any>>>
  defineUserMarkers: (markerMap: MarkerMap, userObj: User) => void;
  generatePopupContent: (marker: any) => string;
  attachMapLayerObjToMarkerInHashmap: (geojson: FirestoreMarker, layer: L.Layer, hashmap: MarkerMap) => void;
  processEdits: (updatedLayerProp: any, addprops: any) => void;
  highlightMarkerCard: (e: any) => void;
}

interface addProps {
  operation: string;
  userObj: User; 
  popupContent: PopupContent; 
}

interface MarkerProviderProps {
  children: React.ReactNode;
}

const MarkerContext = createContext(null as unknown as MarkerContextValue);

const MarkerContextProvider = ({ children }: MarkerProviderProps) => {
  const [allMarkers, setAllMarkers] = React.useState(new Map());
  const [userMarkers, setUserMarkers] = React.useState(new Map());

  const processEdits = (updatedLayerProp: any, addprops: addProps) => {
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

  const defineUserMarkers = (markerMap: MarkerMap, userObj: User) => {
    setUserMarkers(
      new Map([...markerMap].filter(([k, v]) => userObj.uid === v.properties.user.uid))
    );
  };

  const attachMapLayerObjToMarkerInHashmap = (geojson: FirestoreMarker, layer: L.Layer, hashmap: MarkerMap) => {
    const key = geojson.properties.markerId;
    const updatedMarker = hashmap.get(key);
    if (updatedMarker) {
      updatedMarker.mapLayerObj = layer;
      hashmap.set(key, updatedMarker);
    }
  };

  const generatePopupContent = (marker: FirestoreMarker) => {
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

  const highlightMarkerCard = (e: any) => {
    // console.log("Marker Clicked!")
    // console.log(e.target.feature.properties.markerId)
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
