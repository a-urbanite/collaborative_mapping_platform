import {GeoJsonObject} from '../Types'

export const serializeGeoJsonCoords = (geoJsonObj: GeoJsonObject):any => {
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

export const serializeNestedArrays = (arrayOfArrays: number[][]) => {
  console.log("arrayOfArrays in serializeFunc: ", arrayOfArrays)
  // takes [[1,2,3],[4,5,6],[7,8,9]] returns {0:[1,2,3],1:[4,5,6],2:[7,8,9]}
  let obj = arrayOfArrays.reduce((acc, curr, index) => {
    acc[index] = curr;
    return acc;
  }, {} as { [key: number]: number[] });
  return obj;
};