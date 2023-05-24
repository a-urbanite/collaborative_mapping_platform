import React, { FC, ReactNode } from "react";
import { serializeGeoJsonCoords } from './Serialisation'
import { deserializeGeoJsonCoords } from './Deserialisation'
import {GeoJsonObject} from './Types'

interface ContextProps {
  fetchAllMarkers: () => Promise<Map<any, any>>;
  uploadEdits: (userFirestoreMarkers: any) => Promise<Response>;
  markersUpdated: boolean;
  initialFetch: boolean;
}

interface ProviderProps {
  children: ReactNode
}

const FirestoreController = React.createContext(null as unknown as ContextProps);

const FirestoreControllerProvider = ({ children }: ProviderProps) => {
  const [markersUpdated, setmarkersUpdated] = React.useState<boolean>(false);
  const [initialFetch, setinitialFetch] = React.useState<boolean>(true);

  const prepareArrayOfEdits = (markersToUpload: any[]) => {
    return markersToUpload.map((obj: GeoJsonObject) => {
      const compatibleObj = obj;
      obj.geometry.coordinates = serializeGeoJsonCoords(obj);
      return compatibleObj;
    })
  };

  const uploadEditsAJAX = async (markersToUpload: any[]) => {
    const preparedArr = prepareArrayOfEdits(markersToUpload)
    const JsonString = JSON.stringify(preparedArr)
    console.log("PREPPEDARR",JsonString)
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadEdits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JsonString,
    });
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    res = await res.json();
    return res;
  };

  const fetchMarkersAJAX = async () => {
    let markers;
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    console.log("RES FETCH: ", res);
    markers = await res.json();
    markers.forEach((marker: any) => (marker.geometry.coordinates = deserializeGeoJsonCoords(marker)));
    return markers;
  };

  const fetchAllMarkers = async () => {
    try {
      setmarkersUpdated(false);
      setinitialFetch(false);
      const markerMap = new Map();
      const markers = await fetchMarkersAJAX();
      markers.forEach((marker: { properties: { markerId: any; }; }) => {
        markerMap.set(marker.properties.markerId, marker);
      });
      if (markerMap.size === 0) {
        throw new Error("fetched data contains no marker");
      }
      return markerMap;
    } catch (error) {
      throw error;
    }
  };

  const filterMarkersToUpload = (markerMap: any[]) => {
    const markersToUploadArr: any[] = [];
    markerMap.forEach((marker) => {
      if (marker.properties.operationIndicator !== null) {
        delete marker.mapLayerObj;
        markersToUploadArr.push(marker);
      }
    });
    return markersToUploadArr;
  };

  const uploadEdits = async (userFirestoreMarkers: any[]) => {
    try {
      const markersToUploadArr = filterMarkersToUpload(userFirestoreMarkers);
      const res = await uploadEditsAJAX(markersToUploadArr);
      setmarkersUpdated(true);
      return res;
    } catch (error) {
      throw error;
    }
  };


  return (
    <FirestoreController.Provider
      value={{
        fetchAllMarkers,
        uploadEdits,
        markersUpdated,
        initialFetch,
      }}
    >
      {children}
    </FirestoreController.Provider>
  );
};

const useFirestoreController = () => React.useContext(FirestoreController);

export { FirestoreControllerProvider, useFirestoreController };
