import * as React from "react";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { useMarkerContext } from "./MarkerContext";
import { useRouter } from "next/router";
import { auth } from "../../firebase-config";
import { uuidv4 } from "@firebase/util";
import { useModal } from "../Modal/ModalContext";

export default function EditControlFC() {
  const { openModalWithNameForm } = useModal();
  const router = useRouter();
  const { processEdits } = useMarkerContext();
  
  return (
      <EditControl
        position="topright"
        onEdited={(e) => processEdits(e.layers.getLayers(), { operation: "editMarker" })}
        onCreated={async (e) => {
          const userObj =
            router.pathname === "/contribute"
              ? { uid: uuidv4(), displayName: await openModalWithNameForm() }
              : auth.currentUser;
          processEdits(e.layer, { operation: "addMarker", userObj: userObj });
        }}
        onDeleted={(e) => processEdits(e.layers.getLayers(), { operation: "deleteMarker" })}
        draw={{
          rectangle: false,
          circle: false,
          polyline:{
                  showLength: true,
                  metric: true,
                },
          polygon:{
                  allowIntersection: false, // Restricts shapes to simple polygons
                  drawError: {
                    color: "red",
                    message: "That is a terrible polygon! Draw that again!",
                  },
                  // shapeOptions: {color: '#97009c'}
                },
          marker: true,
          circlemarker: false,
        }}
        edit={{
          remove: true,
          edit: true,
        }}
      />
  );
}
