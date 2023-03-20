import * as React from "react";
import * as L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { useFireStoreContext } from "../FireStoreContext";
import { useEffect } from "react";
import { auth } from "../../firebase-config";

interface myLayer extends L.Layer {
  markerId: string;
}

export default function EditControlFC() {
  const {
    userFirestoreMarkers,
    addMarkerToLocalState,
    updateMarkersInLocalState,
    deleteMarkersFromLocalState,
    generatePopupContent
  } = useFireStoreContext();
  const ref = React.useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (ref.current?.getLayers().length === 0 && userFirestoreMarkers) {
      userFirestoreMarkers.forEach((marker: any) => {
        if (marker.properties.operationIndicator !== "deleted in current session") {
          L.geoJSON(marker, {
            onEachFeature: (feature: any, layer: myLayer) => {
              layer.markerId = feature.properties.markerId;
              layer.bindPopup(generatePopupContent(feature));
              ref.current?.addLayer(layer);
              // if (feature.properties.operationIndicator === "popup edited in current session") {
              //   console.log("popup was updated, openPopup loop triggered!")
              //   layer.openPopup()
              // }
            },
          });
        }
      });
    }
  }, [userFirestoreMarkers]);

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={(e) => updateMarkersInLocalState(e)}
        onCreated={(e) => addMarkerToLocalState(e, auth.currentUser)}
        onDeleted={(e) => deleteMarkersFromLocalState(e)}
        draw={{
          rectangle: false,
          circle: false,
          polyline: {
            showLength: true,
            metric: true,
          },
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
              color: "red",
              message: "<strong>That is a terrible polygon! Draw that again!",
            },
            // shapeOptions: {color: '#97009c'}
          },
          marker: true,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
}
