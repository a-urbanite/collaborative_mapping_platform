import React, { ReactNode } from "react";
import { serializeGeoJsonCoords } from "./Serialisation";
import { deserializeGeoJsonCoords } from "./Deserialisation";
import { FirestoreMarker } from "./Types";

interface ContextProps {
  fetchAllMarkers: () => Promise<Map<any, any>>;
  uploadEdits: (userFirestoreMarkers: any) => Promise<Response>;
  markersUpdated: boolean;
  initialFetch: boolean;
}

interface ProviderProps {
  children: ReactNode;
}


const FirestoreController = React.createContext(null as unknown as ContextProps);

const FirestoreControllerProvider = ({ children }: ProviderProps) => {
  const [markersUpdated, setmarkersUpdated] = React.useState<boolean>(false);
  const [initialFetch, setinitialFetch] = React.useState<boolean>(true);

  const prepareMarkersToUpload = (markerMap: any[]) => {
    const markersToUploadArr: any[] = [];
    markerMap.forEach((marker) => {
      if (marker.properties.operationIndicator !== null) {
        delete marker.mapLayerObj;
        marker.geometry.coordinates = serializeGeoJsonCoords(marker);
        markersToUploadArr.push(marker);
      }
    });
    return markersToUploadArr;
  };
  

  const uploadEditsAJAX = async (preparedArr: any[]) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadEdits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preparedArr),
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const body = await res.json();
    return body;
  };

  const uploadEdits = async (userFirestoreMarkers: any[]) => {
    const markersToUpload = prepareMarkersToUpload(userFirestoreMarkers);
    const res = await uploadEditsAJAX(markersToUpload);
    setmarkersUpdated(true);
    return res;
  };

  const fetchAllMarkers = async () => {

    try {
      setmarkersUpdated(false);
      setinitialFetch(false);
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}, ${res.statusText}`);
      const body = await res.json();
  
      const markerMap = new Map();
      body.forEach((marker: FirestoreMarker) => {
        // console.log(JSON.stringify(marker))
        marker.geometry.coordinates = deserializeGeoJsonCoords(marker)
        markerMap.set(marker.properties.markerId, marker);
      });
  
      return markerMap;

    } catch (err) {
        throw new Error("Fetch Error", { cause: err });
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
