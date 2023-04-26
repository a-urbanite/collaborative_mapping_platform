import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer } from "react-leaflet";
import { useRouter } from "next/router";
import EditControlFC from "./EditControlFC";
import MarkerGroup from "./MarkerGroup";
import React from "react";
import { auth } from "../../firebase-config";
import { uuidv4 } from '@firebase/util';

const Map = () => {
  const router = useRouter();
  const ref = React.useRef<L.FeatureGroup>(null);
  const userObj =
    router.pathname === "/myPlaces" ? auth.currentUser : { uid: uuidv4(), displayName: "anon" };

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
      <MarkerGroup FCref={ref} />

      <EditControlFC FCref={ref} userObj={userObj}/>

      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}

      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};

export default Map;
// function uuidv4() {
//   throw new Error("Function not implemented.");
// }
