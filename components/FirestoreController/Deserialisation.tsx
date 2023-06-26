import {GeoJsonObject} from '../../Types'

export const deSerializeNestedArrays = (obj: { [key: number]: number[] }) => {
  // takes {0:[1,2,3],1:[4,5,6],2:[7,8,9]} returns [[1,2,3],[4,5,6],[7,8,9]]
  let array = [];
  for (let key in obj) {
    array.push(obj[key]);
  }
  return array;
};

export const deserializeGeoJsonCoords = (geoJsonObj: GeoJsonObject):any => {
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