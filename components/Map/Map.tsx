import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import DrawingController from "./DrawingController";
import { useMapContext } from "../MapContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FeatureGroup as FeatureGroupType, GeoJSON as GeoJSONType } from 'leaflet';

const Map = ({markers}: any) => {
  const { setMapRef } = useMapContext();
  const [editableLayers, setEditableLayers] = useState(null as unknown as FeatureGroupType);
  const router = useRouter();

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      ref={setMapRef}
    >
      {router.pathname === "/myPlaces" && <DrawingController setEditableLayers={setEditableLayers} editableLayers={editableLayers}/>}
      {router.pathname === "/myPlaces" && markers && editableLayers && <GeoJSON data={markers} onEachFeature={(feature, layer) => editableLayers.addLayer(layer)} />}
      {router.pathname === "/home" && markers && <GeoJSON data={markers} />}
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default Map;
