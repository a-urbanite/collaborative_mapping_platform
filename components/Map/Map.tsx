import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer } from "react-leaflet";
import { useRouter } from "next/router";
import EditControlFC from "./EditControlFC";
import MarkerGroup from "./MarkerGroup";

const Map = () => {
  const router = useRouter();
  
  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      whenReady={() => {
        console.log("MAPLOAD")
      }}
    >

      {router.pathname === "/home" && <MarkerGroup/>}

      {router.pathname === "/myPlaces" && <EditControlFC/>}
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


    </MapContainer>
  );
};

export default Map;
