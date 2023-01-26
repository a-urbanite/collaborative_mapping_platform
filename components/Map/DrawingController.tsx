import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { FeatureGroup, useMap, useMapEvent } from "react-leaflet";
import { useMapContext } from "../MapContext";
import { useUserContext } from "../UserContext";
import { useEffect } from "react";
// import { auth } from "../../firebase-config";

const DrawingController = () => {
  const { addMarker, drawnMarkers } = useMapContext();
  const { userObj } = useUserContext();

  const mapLoad = useMapEvent("viewreset", () => {
    console.log("map load");
  });

  const mapClick = useMapEvent("click", () => {
    console.log("map click");
  });

  useEffect(() => {
    console.log("DarwnMarkers localstate", drawnMarkers);
  }, [drawnMarkers]);

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        edit={{
          remove: false,
        }}
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          polyline: {
            showLength: true,
            metric: true,
          },
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
              color: "red", // Color the shape will turn when intersects
              message: "<strong>That is a terrible polygon! Draw that again!", // Message that will show when intersect
            },
            // shapeOptions: {color: '#97009c'}
          },
        }}
        onEdited={(e) => {
          // console.log("Pressed Save button in edit bar");
        }}
        onCreated={(e) => {
          // console.log("CREATED EVENT", e.layer);
          // const markerGeoJSON = e.layer.toGeoJSON()
          // console.log(markerGeoJSON)
          // console.log("isAuth in DrawController: ", isAuth)
          // console.log("authObj", auth)
          addMarker(e.layer, userObj);
          // console.log(map)
        }}
        onMounted={() => {
          // console.log("onMounted!")
        }}
        onEditStart={() => {
          // console.log("Edit bar opened")
        }}
        onEditStop={() => {
          // console.log("Pressed Cancel button in Edit Bar")
        }}
        onDeleted={() => {
          console.log("onDeleted!");
          // console.log(map._panes.overlayPane.children)
        }}
        onDeleteStart={() => {
          // console.log("onDeleteStart!");
        }}
        onDeleteStop={() => {
          // console.log("onDeleteStop!");
        }}
        onDrawStart={() => {
          // console.log("onDrawStart!");
        }}
        onDrawStop={() => {
          // console.log("onDrawStop!");
        }}
        onDrawVertex={() => {
          // console.log("onDrawVertex!");
        }}
        onEditMove={() => {
          // console.log("onEditMove!");
        }}
        onEditResize={() => {
          // console.log("onEditResize!");
        }}
        onEditVertex={() => {
          // console.log("onEditVertex!");
        }}
      />
    </FeatureGroup>
  );
};

export default DrawingController;
