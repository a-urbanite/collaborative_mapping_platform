import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer } from "react-leaflet";
import EditControlFC from "./EditControlFC";
import MarkerGroup from "./MarkerGroup";
import React from "react";

const Map = ({markers}: any) => {
  const FGref = React.useRef<L.FeatureGroup>(null);

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      whenReady={() => {
        console.log("MAPLOAD");
      }}
    >
      <MarkerGroup FGref={FGref} markers={markers}/>

      <EditControlFC FGref={FGref} />

      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};

export default Map;
