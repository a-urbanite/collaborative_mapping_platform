import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
import EditControlFC from "./EditControlFC";
import MarkerGroup from "./MarkerGroup";
import React from "react";
import { useRouter } from "next/router";

const Map = ({ markers }: any) => {
  const router = useRouter();
  const FGref = React.useRef<L.FeatureGroup | null>(null);

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      // whenReady={() => {
      //   console.log("MAPLOAD");
      // }}
    >
      <FeatureGroup ref={FGref}>
        <MarkerGroup FGref={FGref} markers={markers} />
        {router.pathname !== "/home" && <EditControlFC />}
      </FeatureGroup>

      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};

export default Map;
