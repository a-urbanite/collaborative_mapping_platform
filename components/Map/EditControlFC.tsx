import * as React from 'react';
import * as L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import "leaflet-draw/dist/leaflet.draw.css";
// import { EditControl } from '../../src';
import { EditControl } from "react-leaflet-draw";
import type { FeatureCollection } from 'geojson';
import { useFireStoreContext } from '../FireStoreContext';
import { useEffect } from 'react';
import { uuidv4 } from '@firebase/util';
import { useUserContext } from '../UserContext';

// interface Props {
//   geojson: FeatureCollection;
//   setGeojson: (geojson: FeatureCollection) => void;
// }

export default function EditControlFC() {
  const { userFirestoreMarkers, setUserFirestoreMarkers } = useFireStoreContext();
  const { userObj } = useUserContext();
  const ref = React.useRef<L.FeatureGroup>(null);

  useEffect(() => {
    console.log("current local state: ", userFirestoreMarkers)
  }, [userFirestoreMarkers])
  

  useEffect(() => {
    // console.log(userFirestoreMarkers)
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

  const handleChange = (e: any) => {
    // console.log("newly drawn: ",ref.current)
    console.log("current layer", e.layer.toGeoJSON())
    const geo = ref.current?.toGeoJSON();
    console.log(geo);
    if (geo?.type === 'FeatureCollection') {
      setUserFirestoreMarkers(geo);
    }
  };

  const addmarker = (e: { layer: {
    markerId: string; toGeoJSON: () => any; 
}; }, userObj: { uid: any; displayName: any; }) => {

    //create a new geojson and attach stuff
    const geo = e.layer.toGeoJSON()
    const uuid = uuidv4()
    e.layer.markerId = uuid
    geo.properties = {
      markerId: uuid,
      user: {
        uid: userObj.uid,
        name: userObj.displayName,
      },
      dateCreated: Date.now(),
      popupContent: {title: "default title", text: "default text"},

    }

    //update local state 
    setUserFirestoreMarkers((oldArray: any) => [...oldArray, geo]);
  }

  const editMarker = (e: any) => {

    //create an array of geojsons reflecting the changed layers
    const editedLayersArr = e.layers.getLayers().map((layer: any) => {
      // const markerId = layer.feature.properties.markerId
      const geojson = layer.toGeoJSON()
      geojson.properties = layer.feature.properties
      geojson.properties.dateUpdated = Date.now()
      geojson.properties.updatedInCurrentSession = true
      return geojson
    })

    // update the userFirestoreMarkers state with the edited layers
    const updatedStateArr = userFirestoreMarkers

    editedLayersArr.forEach((editedLayer: any) => {
      const currentMarkerId = editedLayer.properties.markerId
      const index = updatedStateArr.findIndex((marker: any) => marker.properties.markerId === currentMarkerId)
      updatedStateArr.splice(index, 1, editedLayer)
    });

    setUserFirestoreMarkers((oldArray: any) => [...updatedStateArr])
  
  }

  const deleteMarker = (e: any) => {

    const deletedLayersArr = e.layers.getLayers()
    const updatedStateArr = userFirestoreMarkers

    deletedLayersArr.forEach((deletedLayer: any) => {
      const currentMarkerId = deletedLayer.feature.properties.markerId
      const index = updatedStateArr.findIndex((marker: any) => marker.properties.markerId === currentMarkerId)
      if (index != -1) {
        updatedStateArr.splice(index, 1)
      }
    });

    setUserFirestoreMarkers((oldArray: any) => [...updatedStateArr])

  }

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={(e) => editMarker(e)}
        onCreated={(e) => addmarker(e, userObj)}
        onDeleted={(e) => deleteMarker(e)}
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
          marker: true,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
}