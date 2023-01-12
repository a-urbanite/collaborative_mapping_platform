import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { FeatureGroup } from "react-leaflet";

const EditingController = () => {
  return (
    <FeatureGroup>
      <EditControl
        position="topright"
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
          console.log("Pressed Save button in edit bar");
          // console.log("ONEDITED", e)
        }}
        onCreated={(e) => {
          console.log("CREATED EVENT", e);
        }}
        onMounted={() => console.log("onMounted!")}
        onEditStart={() => console.log("Edit bar opened")}
        onEditStop={() => console.log("Pressed Cancel button in Edit Bar")}
        onDeleted={() => {
          console.log("onDeleted!");
        }}
        onDeleteStart={() => console.log("onDeleteStart!")}
        onDeleteStop={() => console.log("onDeleteStop!")}
        onDrawStart={() => console.log("onDrawStart!")}
        onDrawStop={() => console.log("onDrawStop!")}
        onDrawVertex={() => console.log("onDrawVertex!")}
        onEditMove={() => console.log("onEditMove!")}
        onEditResize={() => console.log("onEditResize!")}
        onEditVertex={() => console.log("onEditVertex!")}
      />
    </FeatureGroup>
  );
};

export default EditingController;
