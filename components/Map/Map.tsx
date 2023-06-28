import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import styles from "./map.module.scss";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
import EditControlFC from "./EditControlFC";
import MarkerGroup from "./MarkerGroup";
import React from "react";
import { useRouter } from "next/router";
import EventListenersForStoryButtons from "./EventListenersForStoryButtons";

const Map = ({ markers, className }: any) => {
  const router = useRouter();
  const FGref = React.useRef<L.FeatureGroup | null>(null);
  
  const getMapFocusCoords = () => {
    if ( markers && markers.size == 1) {
      return [...markers.entries()][0][1].geometry.coordinates.slice().reverse() 
    } else {
      return [52.52, 13.405]
    }
  }

  return (
    <MapContainer
      center={getMapFocusCoords()}
      zoom={13}
      scrollWheelZoom={false}
      className={`${styles.map} ${className}`}
      // whenReady={() => {
      //   console.log("MAPLOAD");
      // }}
    >
      <FeatureGroup ref={FGref}>
        <MarkerGroup FGref={FGref} markers={markers} />
        {["/myPlaces", "/contribute"].includes(router.pathname) && <EditControlFC />}
      </FeatureGroup>
      <EventListenersForStoryButtons/>

      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};

export default Map;
