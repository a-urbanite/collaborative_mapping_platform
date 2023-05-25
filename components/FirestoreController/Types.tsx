export interface nonSerialised_GeoJsonPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface nonSerialised_GeoJsonLineString {
  type: "LineString";
  coordinates: [number, number][];
}

export interface nonSerialised_GeoJsonPolygon {
  type: "Polygon";
  coordinates: [number, number][][];
}

export type GeoJsonObject = {
  geometry: nonSerialised_GeoJsonPoint | nonSerialised_GeoJsonLineString | nonSerialised_GeoJsonPolygon;
};

export type MarkerMap = Map<string, FirestoreMarker>;


export type FirestoreMarker = {
  type: string;
  geometry: nonSerialised_GeoJsonPoint | nonSerialised_GeoJsonLineString | nonSerialised_GeoJsonPolygon;
  properties: Properties;
  mapLayerObj?: L.Layer
};

export interface Properties {
  user: User;
  popupContent: PopupContent;
  dateCreated: number;
  dateUpdated?: number;
  operationIndicator?: null;
  markerId: string;
  firebaseDocID: string;
}
export interface User {
  uid: string;
  name: string;
}
export interface PopupContent {
  title: string;
  text: string;
}