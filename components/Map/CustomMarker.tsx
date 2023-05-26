import React from "react";
import { Marker, Popup, GeoJSON } from "react-leaflet";
import { FirestoreMarker } from "../FirestoreController/Types";
import { useMarkerContext } from "./MarkerContext";

interface CustomMarkerProps {
  marker: FirestoreMarker;
  FGref: any;
}

const CustomMarker = ({ marker, FGref }: CustomMarkerProps) => {
  const { generatePopupContent, highlightMarkerCard } = useMarkerContext();
  const markerRef = React.useRef(null);

  React.useEffect(() => {
    const marker = markerRef.current
    console.log("MARKERREF: ", marker)
    const featureGroup = FGref.current
    console.log("FGREF: ", FGref)

    if (featureGroup && marker) {
      featureGroup.addLayer(marker);
    }

    return () => {
      if (featureGroup && marker) {
        featureGroup.removeLayer(marker);
      }
    };
  }, [FGref, marker]);

  return (
    <GeoJSON data={marker.geometry} eventHandlers={{ click: (e) => highlightMarkerCard(e) }} ref={markerRef}>
      <Popup>{generatePopupContent(marker)}</Popup>
    </GeoJSON>
  );
};

export default CustomMarker;
