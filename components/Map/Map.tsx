import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./Map.module.css";
import { MapContainer, TileLayer, useMap, Marker, Popup, FeatureGroup } from "react-leaflet";
import EditingController from "./EditingController";

const Map = () => {
  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    if (mapRef) {
      console.log("MAPREF", mapRef);
      console.log("PANES", mapRef.getPanes());
      // console.log(mapRef.getPane('markerPane').children[0])
    }
  }, [mapRef]);

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      ref={setMapRef}
    >
      <EditingController />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[52.52, 13.405]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
