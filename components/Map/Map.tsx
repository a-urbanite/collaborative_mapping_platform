import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup, Marker } from "react-leaflet";
import { useMapContext } from "../MapContext";
import { useRouter } from "next/router";
import EditControlFC from "./EditControlFC";
import { useFireStoreContext } from "../FireStoreContext";
import { useEffect } from "react";
import * as L from "leaflet";
import MarkerGroup from "./MarkerGroup";

const Map = () => {
  const { mapRef,setMapRef } = useMapContext();
  const router = useRouter();

  // useEffect(() => {
  //   console.log(allFirestoreMarkers)
  // }, [allFirestoreMarkers])

  // useEffect(() => {
  //   if (!allFirestoreMarkers) return;
  //   allFirestoreMarkers.forEach((marker: any) => {
  //     L.geoJSON(marker, {
  //       onEachFeature: (feature: any, layer: any) => {
  //         layer.markerId = feature.properties.markerId;
  //         layer.bindPopup(generatePopupContent(feature));
  //         layer.addTo(mapRef)
  //         // ref.current?.addLayer(layer);
  //         // if (feature.properties.operationIndicator === "popup edited in current session") {
  //         //   setmarkerToHighlight(layer);
  //         // }
  //       },
  //     });
      
  //   });
  // }, [allFirestoreMarkers])
  
  
  
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
