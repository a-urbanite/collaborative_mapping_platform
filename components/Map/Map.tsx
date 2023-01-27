import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import DrawingController from "./DrawingController";
import { useMapContext } from "../MapContext";
import { useRouter } from "next/router";
// import GeoJSON from "geojson";

const Map = ({markers}: any) => {
  const { setMapRef } = useMapContext();
  const router = useRouter();

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      scrollWheelZoom={false}
      className={styles.mapContainer}
      ref={setMapRef}
    >
      {router.pathname === "/myPlaces" && <DrawingController />}

      {markers.map((marker: any) => {
          // const timeObj = Date.parse(location.properties.creationDate);
          // const date = new Date(timeObj).toLocaleDateString();

          return (
            <GeoJSON data={marker} key={marker.properties.firebaseDocID}>
              {/* <Popup>
                <b>{location.properties.featureName}</b>
                <br />
                <b>description:</b> {location.properties.featureDescr}
                <br />
                <b>user name:</b> {location.properties.userName}
                <br />
                <b>creation date:</b> {date}
              </Popup> */}
            </GeoJSON>
          );
        })}

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default Map;
