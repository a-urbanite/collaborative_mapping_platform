import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup, Marker } from "react-leaflet";
import { useMapContext } from "../MapContext";
import { useRouter } from "next/router";
import EditControlFC from "./EditControlFC";
import { useFireStoreContext } from "../FireStoreContext";

const Map = () => {
  const { setMapRef } = useMapContext();
  const { allFirestoreMarkers, generatePopupContent } = useFireStoreContext();
  const router = useRouter();
  
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

      {router.pathname === "/home" && allFirestoreMarkers && 
        allFirestoreMarkers.map((marker: any, index: any) => {
          return (
            <GeoJSON key={index} data={marker}>
              <Popup>
                <div dangerouslySetInnerHTML={{ __html: generatePopupContent(marker) }} />
              </Popup>
            </GeoJSON>
          )
        })
      }

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {router.pathname === "/myPlaces" && <EditControlFC/>}

    </MapContainer>
  );
};

export default Map;
