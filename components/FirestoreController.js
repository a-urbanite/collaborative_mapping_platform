import * as React from "react";

const FirestoreController = React.createContext();

const FirestoreControllerProvider = ({ children }) => {
  const [markersUpdated, setmarkersUpdated] = React.useState(false);
  const [initialFetch, setinitialFetch] = React.useState(true);

  const serializeNestedArrays = (arrayOfArrays) => {
    // takes [[1,2,3],[4,5,6],[7,8,9]] returns {0:[1,2,3],1:[4,5,6],2:[7,8,9]}
    let obj = arrayOfArrays.reduce((acc, curr, index) => {
      acc[index] = curr;
      return acc;
    }, {});
    return obj;
  };

  const deSerializeNestedArrays = (obj) => {
    // takes {0:[1,2,3],1:[4,5,6],2:[7,8,9]} returns [[1,2,3],[4,5,6],[7,8,9]]
    let array = [];
    for (let key in obj) {
      array.push(obj[key]);
    }
    return array;
  };

  const serializeGeoJsonCoords = (geoJsonObj) => {
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

  const deserializeGeoJsonCoords = (geoJsonObj) => {
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

  const convertToFirestoreCompatibleGeojson = (obj) => {
    const geoJsonStr = obj;
    obj.geometry.coordinates = serializeGeoJsonCoords(obj);
    return geoJsonStr;
  };

  const uploadEditsAJAX = async (markersToUpload) => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploadEdits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        markersToUpload.map((obj) => JSON.stringify(convertToFirestoreCompatibleGeojson(obj)))
      ),
    });
    if (!res.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    res = await res.json();
    return res;
  };

  const fetchMarkersAJAX = async () => {
    let markers;
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    console.log("RES FROM INITAL FETCH: ", res);
    markers = await res.json();
    markers.forEach((marker) => (marker.geometry.coordinates = deserializeGeoJsonCoords(marker)));
    return markers;
  };

  const fetchAllMarkers = async () => {
    try {
      setmarkersUpdated(false);
      setinitialFetch(false);
      const markerMap = new Map();
      const markers = await fetchMarkersAJAX();
      markers.forEach((marker) => {
        markerMap.set(marker.properties.markerId, marker);
      });
      if (markerMap.length === 0) {
        throw new Error("fetched data contains no marker");
      }
      return markerMap;
    } catch (error) {
      throw error;
    }
  };

  const filterMarkersToUpload = (markerMap) => {
    const markersToUploadArr = [];
    markerMap.forEach((marker) => {
      if (marker.properties.operationIndicator !== null) {
        delete marker.mapLayerObj;
        markersToUploadArr.push(marker);
      }
    });
    return markersToUploadArr;
  };

  const uploadEdits = async (userFirestoreMarkers) => {
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
