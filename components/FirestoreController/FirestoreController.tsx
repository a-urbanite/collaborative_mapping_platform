import React, { ReactNode } from "react";
import { serializeGeoJsonCoords } from "./Serialisation";
import { deserializeGeoJsonCoords } from "./Deserialisation";
import { FirestoreMarker, MarkerMap } from "../../Types";

interface ContextProps {
  fetchAllMarkers: () => Promise<MarkerMap>;
  uploadEdits: (userFirestoreMarkers: MarkerMap) => Promise<Response>;
  fetchSingleMarker: (orderNum: number, title: string) => Promise<FirestoreMarker>;
  deleteAllMarkers: () => Promise<Response>;
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

  const uploadEdits = async (userMarkers: MarkerMap) => {
    try {
      const reshapedGeoJsonArr = Array.from(userMarkers.values())
        .filter((marker) => marker.properties.operationIndicator !== null)
        .map((marker) => ({
          ...marker,
          mapLayerObj: undefined,
          geometry: {
            type: marker.geometry.type,
            coordinates: serializeGeoJsonCoords(marker),
          },
        }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadEdits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reshapedGeoJsonArr),
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const body = await res.json();

      setmarkersUpdated(true);
      return body;
    } catch (err) {
      throw new Error("Upload Error", { cause: err });
    }
  };

  const fetchAllMarkers = async () => {
    try {
      setmarkersUpdated(false);
      setinitialFetch(false);

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}, ${res.statusText}`);
      const body = await res.json();

      const preppedMarkerArr = body.map((marker: FirestoreMarker) => ({
        ...marker,
        geometry: {
          type: marker.geometry.type,
          coordinates: deserializeGeoJsonCoords(marker),
        },
      }));
      const markerMap: MarkerMap = new Map(
        preppedMarkerArr.map((marker: FirestoreMarker) => [marker.properties.markerId, marker])
      );

      return markerMap;
    } catch (err) {
      throw new Error("Fetch Error", { cause: err });
    }
  };

  const fetchSingleMarker = async (orderNum: number, title: string) => {
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({orderNum: orderNum, title: title}),
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}, ${res.statusText}`);
      const marker = await res.json();

      return marker;
    } catch (err) {
      throw new Error("Fetch Error", { cause: err });
    }
  }

  const deleteAllMarkers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/deleteAllMarkers`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}, ${res.statusText}`);
      setmarkersUpdated(true);
      const body = await res.json();
      return body
    } catch (err) {
      throw new Error("Fetch Error", { cause: err });
    }
  }

  return (
    <FirestoreController.Provider
      value={{
        fetchAllMarkers,
        uploadEdits,
        fetchSingleMarker,
        deleteAllMarkers,
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
