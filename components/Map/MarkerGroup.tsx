import React from "react";
import { useFireStoreContext } from "../FireStoreContext";
import * as L from "leaflet";
import { useMap } from "react-leaflet";

const MarkerGroup = () => {
  const { allFirestoreMarkers, generatePopupContent, attachMapLayerObjToMarkerInHashmap } =
    useFireStoreContext();
  const map = useMap();

  // React.useEffect(() => {
  //   console.log("allFirestoreMarkers", allFirestoreMarkers);
  // }, [allFirestoreMarkers]);

  React.useEffect(() => {
    const myLayerGroup = L.layerGroup().addTo(map);

    if (!allFirestoreMarkers) return;
    allFirestoreMarkers.forEach((marker: any, key: any) => {
      L.geoJSON(marker, {
        onEachFeature: (feature: any, layer: any) => {
          layer.bindPopup(generatePopupContent(feature));
          myLayerGroup.addLayer(layer);
          attachMapLayerObjToMarkerInHashmap(feature, layer, allFirestoreMarkers);
        },
      });
    });

    return () => {
      myLayerGroup.clearLayers();
    };
  }, [allFirestoreMarkers]);

  return <></>;
};

export default React.memo(MarkerGroup);
