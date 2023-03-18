import { uuidv4 } from '@firebase/util';

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
  const geoJsonStr = obj
  obj.geometry.coordinates = serializeGeoJsonCoords(obj);
  return geoJsonStr;
};

const createGeojsonFromLayer = (layer, userObj) => {
  const geojson = layer.toGeoJSON()
  const uuid = uuidv4()
  layer.markerId = uuid
  geojson.properties = {
    markerId: uuid,
    user: {
      uid: userObj.uid,
      name: userObj.displayName,
    },
    dateCreated: Date.now(),
    popupContent: {title: "default title", text: "default text"},
    operationIndicator: "drawn in current session"
  }
  return geojson
}

const createUpdatedGeojsonFromLayer = (layer) => {
  const geojson = layer.toGeoJSON()
  geojson.properties = layer.feature.properties
  geojson.properties.dateUpdated = Date.now()
  geojson.properties.operationIndicator = "updated in current session"
  return geojson
}

export {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToFirestoreCompatibleGeojson,
  createGeojsonFromLayer,
  createUpdatedGeojsonFromLayer
};
