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