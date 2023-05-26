import { uuidv4 } from '@firebase/util';
import { LeafletMarker, CustomLeafletMarker, UserObj, FirebaseUser, FirestoreMarker, PopupContentObj } from './FirestoreController/Types';

const createNewGeojsonFromLayer = (layer: LeafletMarker, userObj: FirebaseUser | UserObj) => {
  console.log("inside createNewGSONfromLayer")
  const geojson = layer.toGeoJSON();
  const uuid = uuidv4();
  (layer as CustomLeafletMarker).markerId = uuid;
  geojson.properties = {
    markerId: uuid,
    user: {
      uid: userObj.uid,
      displayName: userObj.displayName,
    },
    dateCreated: Date.now(),
    popupContent: {title: "default title", text: "default text"},
    operationIndicator: "created in current session"
  }
  return geojson
}

const createUpdatedGeojsonFromLayer = (layer: LeafletMarker) => {
  const geojson = layer.toGeoJSON()
  geojson.properties = layer.feature!.properties
  geojson.properties.dateUpdated = Date.now()
  geojson.properties.operationIndicator = "updated in current session"
  return geojson
}

const createGeojsonMarkedForDeletionFromLayer = (layer: LeafletMarker) => {
  const geojson = layer.toGeoJSON()
  geojson.properties = layer.feature!.properties
  geojson.properties.operationIndicator = "deleted in current session"
  return geojson
}

const createGeojsonWithUpdatedPopup = (currentMarker: FirestoreMarker, popupContent: PopupContentObj) => {
  const updatedGeojson = currentMarker;
  updatedGeojson.properties.popupContent = popupContent;
  updatedGeojson.properties.dateUpdated = Date.now();
  updatedGeojson.properties.operationIndicator = "popup edited in current session";
  return updatedGeojson
}

export {
  createNewGeojsonFromLayer,
  createUpdatedGeojsonFromLayer,
  createGeojsonMarkedForDeletionFromLayer,
  createGeojsonWithUpdatedPopup,
};
