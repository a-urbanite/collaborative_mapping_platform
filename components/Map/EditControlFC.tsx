import * as React from "react";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { useMarkerContext } from "../MarkerContext";
import { useModalContext } from "../ModalContext";
import { useRouter } from "next/router";
import { auth } from "../../firebase-config";
import { uuidv4 } from "@firebase/util";
// import useModal2 from "../Modal2/Modal2Hook";
import { useModal2 } from "../../components/Modal2/Modal2Context";

export default function EditControlFC({ FGref }: any) {
  const { openModal } = useModal2();
  // const {Modal2, modalRef} = useModal2();
  const router = useRouter();
  const { processEdits } = useMarkerContext();
  // const { openModalWithNameForm, userName } = useModalContext();
  // const userObj = router.pathname === "/myPlaces" ? auth.currentUser : { uid: uuidv4(), displayName: "anon" };

  return (
    <FeatureGroup ref={FGref}>
      <EditControl
        position="topright"
        onEdited={(e) => processEdits(e.layers.getLayers(), { operation: "editMarker" })}
        // onCreated={(e) => {
        //   let userObj = auth.currentUser
        //   if (router.pathname="/contribute") {
        //     openModalWithNameForm(e.layer)
        //   } else {
        //     processEdits(e.layer, { operation: "addMarker", userObj: userObj })
        //   }
        // }}
        onCreated={async (e) => {
          let userObj;
          if ( !auth.currentUser && router.pathname === "/contribute") {
            const userName = await openModal();
            userObj = { uid: uuidv4(), displayName: userName };
          } else {
            userObj = auth.currentUser;
          }
          processEdits(e.layer, { operation: "addMarker", userObj: userObj });
        }}
        onDeleted={(e) => processEdits(e.layers.getLayers(), { operation: "deleteMarker" })}
        draw={{
          rectangle: false,
          circle: false,
          polyline:
            router.pathname === "/home"
              ? false
              : {
                  showLength: true,
                  metric: true,
                },
          polygon:
            router.pathname === "/home"
              ? false
              : {
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
          edit: router.pathname === "/home" ? false : true,
        }}
      />
    </FeatureGroup>
  );
}
