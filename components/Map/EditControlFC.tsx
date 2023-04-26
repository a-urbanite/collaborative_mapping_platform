import * as React from "react";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { useMarkerContext } from "../MarkerContext";
import { useRouter } from "next/router";

export default function EditControlFC({FCref, userObj}: any) {
  const router = useRouter();
  const { processEdits } = useMarkerContext();

  return (
    <FeatureGroup ref={FCref}>
      <EditControl
        position="topright"
        onEdited={(e) => processEdits(e.layers.getLayers(), { operation: "editMarker" })}
        onCreated={(e) => processEdits(e.layer, { operation: "addMarker", userObj: userObj })}
        onDeleted={(e) => processEdits(e.layers.getLayers(), { operation: "deleteMarker" })}
        draw={{
          rectangle: false,
          circle: false,
          polyline: router.pathname === "/home" ? false : {
            showLength: true,
            metric: true,
          },
          polygon: router.pathname === "/home" ? false : {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
              color: "red",
              message: "That is a terrible polygon! Draw that again!",
            },
            // shapeOptions: {color: '#97009c'}
          },
          marker: router.pathname === "/home" ? false : true,
          circlemarker: false,
        }}
        edit={{
          remove: router.pathname === "/home" ? false : true,
          edit: router.pathname === "/home" ? false : true
        }}
      />
    </FeatureGroup>
  );
}
