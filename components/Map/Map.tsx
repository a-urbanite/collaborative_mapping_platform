import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./Map.module.css";
import { MapContainer, TileLayer, useMap, Marker, Popup, FeatureGroup } from "react-leaflet";
import DrawingController from "./DrawingController";
import { useMapRefContext } from "../MapRefContext";

const Map = () => {
  const { setMapRef } = useMapRefContext();

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      ref={setMapRef}
    >
      <DrawingController />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default Map;
