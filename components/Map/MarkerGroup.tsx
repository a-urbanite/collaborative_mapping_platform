import React from 'react'
import { useFireStoreContext } from "../FireStoreContext";
import * as L from "leaflet";
import { useMap } from 'react-leaflet';

const MarkerGroup = () => {
  const { allFirestoreMarkers, generatePopupContent, setAllFirestoreMarkers, updateMarkerInHashmap } = useFireStoreContext();
  const map = useMap()

  React.useEffect(() => {
    console.log("allFirestoreMarkers", allFirestoreMarkers)
  }, [allFirestoreMarkers])

  React.useEffect(() => {
    // console.log("allfirestoremarkers useeffect triggered")
    // console.log("FETCHEDMARKERS: ", fetchedMarkersArr)
    const myLayerGroup = L.layerGroup().addTo(map); 
    // myLayerGroup.addTo(map)

    // const updatedMap = new Map(fetchedMarkersArr)

    if (!allFirestoreMarkers) return;
    allFirestoreMarkers.forEach((marker: any, key:any) => {
      L.geoJSON(marker, {
        onEachFeature: (feature: any, layer: any) => {
          // layer.markerId = feature.properties.markerId;
          layer.bindPopup(generatePopupContent(feature));
          myLayerGroup.addLayer(layer)
          updateMarkerInHashmap(feature, layer)
          // console.log(typeof key, key)
          // console.log(typeof feature.properties.markerId)
          // console.log("UPDATETETEET", updatedMap.get(feature.properties.markerId))
          // const geojson = updatedMap.get(feature.properties.markerId)
          // elementToUpdate.mapLayerObj = layer
          // console.log(marker)
          // updatedMap.set(feature.properties.markerId, {geojson: feature, maplayerObj: layer})
        },
      });  
    });

    // console.log(updatedMap)

    // setAllFirestoreMarkers(updatedMap)

    return () => {
      myLayerGroup.clearLayers()
    }

  }, [allFirestoreMarkers])
  
  return (
    <></>
  )
}

export default React.memo(MarkerGroup)