import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup, Marker } from "react-leaflet";
import DrawingController from "./DrawingController";
import { useMapContext } from "../MapContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { FeatureCollection } from 'geojson';
import EditControlFC from "./EditControlFC";

const Map = ({ markers }: any) => {
  const { setMapRef } = useMapContext();
  const router = useRouter();
  
  const [geojson, setGeojson] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: markers,
  });

  useEffect(() => {
    setGeojson(markers)
  }, [markers])
  

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      ref={setMapRef}
      whenReady={() => {
        console.log("MAPLOAD")
      }}
    >
      {/* {router.pathname === "/myPlaces" && markers && (
            <FeatureGroup >
              <Marker position={[50.5, 30.5]}>
                <Popup>Hello world</Popup>
              </Marker>
              <GeoJSON data={markers}/>
              <DrawingController/>
            </FeatureGroup>
      )} */}

      {router.pathname === "/home" && markers && <GeoJSON data={markers} />}

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {router.pathname === "/myPlaces" && <EditControlFC/>}

    </MapContainer>
  );
};

export default Map;
