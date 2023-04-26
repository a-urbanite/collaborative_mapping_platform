import * as React from "react";
import * as L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { useMarkerContext } from "../MarkerContext";
import { useEffect } from "react";
import { auth } from "../../firebase-config";

// interface myLayer extends L.Layer {
//   markerId: string;
// }

export default function EditControlFC() {
  const {
    userFirestoreMarkers,
    generatePopupContent,
    attachMapLayerObjToMarkerInHashmap,
    processEdits,
    highlightMarkerCard,
  } = useMarkerContext();

  const ref = React.useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (ref.current?.getLayers().length !== 0 || !userFirestoreMarkers) {
      return;
    }
    userFirestoreMarkers.forEach((marker: any) => {
      if (marker.properties.operationIndicator == "deleted in current session") {
        return;
      }
      L.geoJSON(marker, {
        onEachFeature: (feature: any, layer: any) => {
          layer.bindPopup(generatePopupContent(feature));
          layer.on("click", highlightMarkerCard);
          ref.current?.addLayer(layer);
          attachMapLayerObjToMarkerInHashmap(feature, layer, userFirestoreMarkers);
        },
      });
    });
  }, [userFirestoreMarkers]);

  // useEffect(() => {
  //   console.log("curent user markers", userFirestoreMarkers)
  // }, [userFirestoreMarkers]);

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={(e) => processEdits(e.layers.getLayers(), { operation: "editMarker" })}
        onCreated={(e) => processEdits(e.layer, { operation: "addMarker", userObj: auth.currentUser })}
        onDeleted={(e) => processEdits(e.layers.getLayers(), { operation: "deleteMarker" })}
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
