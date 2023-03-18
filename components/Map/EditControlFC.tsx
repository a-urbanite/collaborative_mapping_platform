import * as React from 'react';
import * as L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { useFireStoreContext } from '../FireStoreContext';
import { useEffect } from 'react';
import { useUserContext } from '../UserContext';


interface myLayer extends L.Layer{
  markerId: string
}

export default function EditControlFC() {
  const { userFirestoreMarkers, addMarkerToLocalState, updateMarkerInLocalState } = useFireStoreContext();
  const { userObj } = useUserContext();
  const ref = React.useRef<L.FeatureGroup>(null);

  useEffect(() => {
    console.log("current local state: ", userFirestoreMarkers)
  }, [userFirestoreMarkers])

  useEffect(() => {
    // console.log("USEEFFECT TRIGGERED")
    if (ref.current?.getLayers().length === 0 && userFirestoreMarkers ) {
      L.geoJSON(userFirestoreMarkers, {
        onEachFeature: (feature: any, layer: myLayer ) => {
          layer.markerId = feature.properties.markerId;
          layer.bindPopup(feature.properties.popupContent.title)
          ref.current?.addLayer(layer);
        }
      })
    }

  }, [userFirestoreMarkers]);
  
  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={(e) => updateMarkerInLocalState(e)}
        onCreated={(e) => addMarkerToLocalState(e.layer, userObj)}
        // onDeleted={(e) => deleteMarker(e)}
        edit={{
          remove: false,
        }}
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