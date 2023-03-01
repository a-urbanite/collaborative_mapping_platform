import * as React from 'react';
import * as L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import "leaflet-draw/dist/leaflet.draw.css";
// import { EditControl } from '../../src';
import { EditControl } from "react-leaflet-draw";
import type { FeatureCollection } from 'geojson';
import { useFireStoreContext } from '../FireStoreContext';
import { useEffect } from 'react';

// interface Props {
//   geojson: FeatureCollection;
//   setGeojson: (geojson: FeatureCollection) => void;
// }

export default function EditControlFC() {
  const { userFirestoreMarkers, setUserFirestoreMarkers } = useFireStoreContext();
  const ref = React.useRef<L.FeatureGroup>(null);

  // useEffect(() => {
  //   console.log(userFirestoreMarkers)
  // }, [userFirestoreMarkers])
  

  useEffect(() => {
    if (ref.current?.getLayers().length === 0 && userFirestoreMarkers) {
      L.geoJSON(userFirestoreMarkers).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          // console.log("layer on Geojson func: ", layer)
          layer.bindPopup("popupContent")
          ref.current?.addLayer(layer);
        }
      });
    }
  }, [userFirestoreMarkers]);

  const handleChange = () => {
    const geo = ref.current?.toGeoJSON();
    console.log(geo);
    if (geo?.type === 'FeatureCollection') {
      setUserFirestoreMarkers(geo);
    }
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleChange}
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
              color: "red", // Color the shape will turn when intersects
              message: "<strong>That is a terrible polygon! Draw that again!", // Message that will show when intersect
            },
            // shapeOptions: {color: '#97009c'}
          },
          marker: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
}