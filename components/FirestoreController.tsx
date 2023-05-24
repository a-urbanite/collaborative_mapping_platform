import React, { FC, ReactNode } from "react";

interface ContextProps {
  fetchAllMarkers: () => Promise<Map<any, any>>;
  uploadEdits: (userFirestoreMarkers: any) => Promise<Response>;
  markersUpdated: boolean;
  initialFetch: boolean;
}

interface ProviderProps {
  children: ReactNode
}



interface nonSerialised_GeoJsonPoint {
  type: "Point";
  coordinates: [number, number];
}

interface nonSerialised_GeoJsonLineString {
  type: "LineString";
  coordinates: [number, number][];
}

interface nonSerialised_GeoJsonPolygon {
  type: "Polygon";
  coordinates: [number, number][][];
}

type GeoJsonObject = {
  geometry: nonSerialised_GeoJsonPoint | nonSerialised_GeoJsonLineString | nonSerialised_GeoJsonPolygon;
};

const FirestoreController = React.createContext(null as unknown as ContextProps);

const FirestoreControllerProvider = ({ children }: ProviderProps) => {
  const [markersUpdated, setmarkersUpdated] = React.useState(false);
  const [initialFetch, setinitialFetch] = React.useState(true);

  const serializeNestedArrays = (arrayOfArrays: number[][]) => {
    console.log("arrayOfArrays in serializeFunc: ", arrayOfArrays)
    // takes [[1,2,3],[4,5,6],[7,8,9]] returns {0:[1,2,3],1:[4,5,6],2:[7,8,9]}
    let obj = arrayOfArrays.reduce((acc, curr, index) => {
      acc[index] = curr;
      return acc;
    }, {} as { [key: number]: number[] });
    return obj;
  };

  const deSerializeNestedArrays = (obj: { [key: number]: number[] }) => {
    // takes {0:[1,2,3],1:[4,5,6],2:[7,8,9]} returns [[1,2,3],[4,5,6],[7,8,9]]
    let array = [];
    for (let key in obj) {
      array.push(obj[key]);
    }
    return array;
  };

  const serializeGeoJsonCoords = (geoJsonObj: GeoJsonObject):any => {
    let serializedCoordsObj;
    switch (geoJsonObj.geometry.type) {
      case "Point":
        serializedCoordsObj = geoJsonObj.geometry.coordinates;
        break;
      case "LineString":
        serializedCoordsObj = serializeNestedArrays(geoJsonObj.geometry.coordinates);
        break;
      case "Polygon":
        serializedCoordsObj = { 0: serializeNestedArrays(geoJsonObj.geometry.coordinates[0]) };
        break;
    }
    return serializedCoordsObj;
  };

  const deserializeGeoJsonCoords = (geoJsonObj: GeoJsonObject):any => {
    let deserializedCoordsObj;
    switch (geoJsonObj.geometry.type) {
      case "Point":
        deserializedCoordsObj = geoJsonObj.geometry.coordinates;
        break;
      case "LineString":
        deserializedCoordsObj = deSerializeNestedArrays(geoJsonObj.geometry.coordinates);
        break;
      case "Polygon":
        deserializedCoordsObj = [deSerializeNestedArrays(geoJsonObj.geometry.coordinates[0])];
        break;
    }
    return deserializedCoordsObj;
  };

  const convertToFirestoreCompatibleGeojson = (obj: GeoJsonObject) => {
    const compatibleObj = obj;
    obj.geometry.coordinates = serializeGeoJsonCoords(obj);
    return compatibleObj;
  };

  const uploadEditsAJAX = async (markersToUpload: any[]) => {
    const preparedArr = markersToUpload.map((obj) => JSON.stringify(convertToFirestoreCompatibleGeojson(obj)))
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
