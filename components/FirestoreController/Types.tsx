import * as L from 'leaflet'
import { User } from "firebase/auth";

export type FirebaseUser = User;

export type MarkerMap = Map<string, FirestoreMarker>;

export type LeafletMarker = L.Marker
export interface CustomLeafletMarker extends LeafletMarker {
  markerId: string
}

export type FirestoreMarker = {
  type: string;
  geometry: nonSerialised_GeoJsonPoint | nonSerialised_GeoJsonLineString | nonSerialised_GeoJsonPolygon;
  properties: Properties;
  mapLayerObj?: L.Marker
};

export interface Properties {
  user: UserObj;
  popupContent: PopupContentObj;
  dateCreated: number;
  dateUpdated?: number;
  operationIndicator?: null | string;
  markerId: string;
  firebaseDocID: string;
}
export interface UserObj {
  uid: string;
  displayName: string;
}
export interface PopupContentObj {
  title: string;
  text: string;
}

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