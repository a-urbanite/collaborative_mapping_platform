import React, { ReactNode } from "react";
import { serializeGeoJsonCoords } from "./Serialisation";
import { deserializeGeoJsonCoords } from "./Deserialisation";

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
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadEdits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preparedArr),
    });
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    res = await res.json();
    return res;
  };

  const uploadEdits = async (userFirestoreMarkers: any[]) => {
    try {
      const markersToUpload = prepareMarkersToUpload(userFirestoreMarkers);
      const res = await uploadEditsAJAX(markersToUpload);
      setmarkersUpdated(true);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const fetchMarkersAJAX = async () => {
    let markers;
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    // console.log("RES FETCH: ", res);
    markers = await res.json();
    markers.forEach((marker: any) => (marker.geometry.coordinates = deserializeGeoJsonCoords(marker)));
    return markers;
  };

  const fetchAllMarkers = async () => {
    try {
      setmarkersUpdated(false);
      setinitialFetch(false);

      const markers = await fetchMarkersAJAX();
      if (markers.length === 0) throw new Error("fetched data contains no marker");

      const markerMap = new Map();
      markers.forEach((marker: { properties: { markerId: string } }) => {
        markerMap.set(marker.properties.markerId, marker);
      });

      return markerMap;
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
