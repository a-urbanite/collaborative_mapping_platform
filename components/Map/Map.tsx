import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { MapContainer, TileLayer, GeoJSON, Popup, FeatureGroup, Marker } from "react-leaflet";
import DrawingController from "./DrawingController";
import { useMapContext } from "../MapContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { FeatureCollection, GeoJsonObject } from 'geojson';
import EditControlFC from "./EditControlFC";
import { useFireStoreContext } from "../FireStoreContext";
// import Geometry
import { Geometry } from 'geojson';
import L from "leaflet";


// interface Feature<G extends Geometry | null = Geometry, P = {}> extends GeoJsonObject {
//   type: "Feature";
//   geometry: G;
//   properties: P;
// }


const Map = () => {
  const { setMapRef } = useMapContext();
  const { allFirestoreMarkers } = useFireStoreContext();
  const router = useRouter();

  // useEffect(() => {
  //   console.log("MAPOBJ", mapRef)
  // }, [mapRef])
  
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
                <h2>{marker.properties.popupContent.title}</h2>
                <p>{marker.properties.popupContent.title}</p>
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
