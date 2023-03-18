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
import { useMapContext } from '../MapContext';
import { serializeGeoJsonCoords } from '../FireStoreContext_utils';
import { addDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { collRef } from '../../firebase-config';

// import { useFireStoreContext } from '../FireStoreContext';

// interface Props {
//   geojson: FeatureCollection;
//   setGeojson: (geojson: FeatureCollection) => void;
// }

interface myLayer extends L.Layer{
  markerId: string
}

export default function EditControlFC() {
  const { userFirestoreMarkers, setUserFirestoreMarkers } = useFireStoreContext();
  // const { addMarker } = useMapContext();
  const { userObj } = useUserContext();
  const ref = React.useRef<L.FeatureGroup>(null);

  useEffect(() => {
    console.log("current local state: ", userFirestoreMarkers)
  }, [userFirestoreMarkers])

  useEffect(() => {
    console.log("USEFFECT TRIGGERED")
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
  

  // useEffect(() => {
  //   // console.log(userFirestoreMarkers)
  //   if (ref.current?.getLayers().length === 0 && userFirestoreMarkers) {
  //     L.geoJSON(userFirestoreMarkers).eachLayer((layer) => {
  //       if (
  //         layer instanceof L.Polyline ||
  //         layer instanceof L.Polygon ||
  //         layer instanceof L.Marker
  //       ) {
  //         // console.log("layer on Geojson func: ", layer)
  //         layer.bindPopup("popupContent")
  //         ref.current?.addLayer(layer);
  //       }
  //     });
  //   }
  // }, [userFirestoreMarkers]);

  // const handleChange = (e: any) => {
  //   const geo = ref.current?.toGeoJSON();
  //   if (geo?.type === 'FeatureCollection') {
  //     setUserFirestoreMarkers(geo);
  //   }
  // };

  const addMarker = async (e: { layer: {
    markerId: string; toGeoJSON: () => any; 
}; }, userObj: { uid: any; displayName: any; }) => {

    //create a new geojson and attach stuff
    const geojson = e.layer.toGeoJSON()
    const uuid = uuidv4()
    e.layer.markerId = uuid
    geojson.properties = {
      markerId: uuid,
      user: {
        uid: userObj.uid,
        name: userObj.displayName,
      },
      dateCreated: Date.now(),
      popupContent: {title: "default title", text: "default text"},
      // operationIndicator: "drawn in current session",
      // drawnInCurrentSession: true
    }

    //upload to firestore
    const markerToUpload = geojson
    markerToUpload.geometry.coordinates = serializeGeoJsonCoords(geojson);
    await addDoc(collRef, markerToUpload);

    //update local state 
    console.log("before stat update")
    setUserFirestoreMarkers((oldArray: any) => [...oldArray, geojson]);
  }

  const editMarker = async (e: any) => {

    //create an array of geojsons containing the edited layers
    const editedLayersArr = e.layers.getLayers().map((layer: any) => {
      // const markerId = layer.feature.properties.markerId
      const geojson = layer.toGeoJSON()
      geojson.properties = layer.feature.properties
      geojson.properties.dateUpdated = Date.now()
      // geojson.properties.operationIndicator = "updated in current session"
      geojson.properties.updatedInCurrentSession = true
      return geojson
    })



    // update the userFirestoreMarkers state with the edited layers
    const updatedStateArr = userFirestoreMarkers

    editedLayersArr.forEach(async (editedLayer: any) => {

      //update the marker at firestore
      const markerId = editedLayer.properties.markerId
      const q = query(collRef, where('properties.markerId', '==', markerId));
      const querySnapshot = await getDocs(q)
      const docRef = querySnapshot.docs[0].ref;
      editedLayer.geometry.coordinates = serializeGeoJsonCoords(editedLayer);
      await updateDoc(docRef, editedLayer)

      const currentMarkerId = editedLayer.properties.markerId
      const index = updatedStateArr.findIndex((marker: any) => marker.properties.markerId === currentMarkerId)
      updatedStateArr.splice(index, 1, editedLayer)
    });

    setUserFirestoreMarkers((oldArray: any) => [...updatedStateArr])
  
  }


  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={(e) => editMarker(e)}
        onCreated={(e) => addMarker(e, userObj)}
        // onDeleted={(e) => deleteMarker(e)}
        edit={{
          remove: false,
          // featureGroup: editableLayers,
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