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

const convertToGeoJsonStr = (obj) => {
  // const geoJsonObj = obj.mapLayerObj.toGeoJSON();
  // geoJsonObj.properties = {
  //   id: obj.id,
  //   user: obj.user,
  //   dateCreated: obj.dateCreated,
  //   popupContent: obj.popupContent,
  // };
  obj.geometry.coordinates = serializeGeoJsonCoords(obj);
  // const geoJsonStr = JSON.stringify(obj);
  return obj;
};

export {
  serializeNestedArrays,
  deSerializeNestedArrays,
  serializeGeoJsonCoords,
  deserializeGeoJsonCoords,
  convertToGeoJsonStr,
};
