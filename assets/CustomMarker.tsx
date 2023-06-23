import React from "react";
import { Marker, Popup, GeoJSON } from "react-leaflet";
import { FirestoreMarker, LeafletMarker, MarkerMap } from "../components/Types";
import { useMarkerContext } from "../components/Map/MarkerContext";
import L from "leaflet";

interface CustomMarkerProps {
  marker: FirestoreMarker;
  markers: MarkerMap;
  FGref: any;
}

const CustomMarker = ({ marker, FGref, markers }: CustomMarkerProps) => {
  const { generatePopupContent, highlightMarkerCard, attachMapLayerObjToMarkerInHashmap } =
    useMarkerContext();
  const markerRef = React.useRef(null);

  React.useEffect(() => {
    if (FGref.current?.getLayers().length === 0 && markers) {
      markers.forEach((feature: any) => {
        const layer = L.geoJSON(feature);
        FGref.current?.addLayer(layer);
      });
    }
  }, [markers]);

  // React.useEffect(() => {
  //   const Leafletmarker = markerRef.current
  //   // const Leafletmarker = new L.GeoJSON(marker)
  //   console.log("MARKERREF: ", marker)
  //   const featureGroup = FGref.current
  //   console.log("FGREF: ", FGref)

  //   if (featureGroup && marker) {
  //     featureGroup.addLayer(Leafletmarker);
  //   }

  //   return () => {
  //     if (featureGroup && marker) {
  //       featureGroup.removeLayer(Leafletmarker);
  //     }
  //   };
  // }, [FGref, marker]);

  if (FGref.current) {
    return (
      <GeoJSON
        data={marker.geometry}
        eventHandlers={{ click: (e) => highlightMarkerCard(e) }}
        ref={markerRef}
        onEachFeature={(feature: any, layer: LeafletMarker) => {
          // FGref.current.addLayer(layer);
          attachMapLayerObjToMarkerInHashmap(marker, layer, markers);
        }}
      >
        <Popup>{generatePopupContent(marker)}</Popup>
      </GeoJSON>
    );
  } else return null
};

export default CustomMarker;
