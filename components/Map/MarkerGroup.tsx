import React from "react";
import { useMarkerContext } from "../MarkerContext";
import * as L from "leaflet";
import { useMap } from "react-leaflet";

const MarkerGroup = () => {
  const { allFirestoreMarkers, generatePopupContent, attachMapLayerObjToMarkerInHashmap } =
    useMarkerContext();
  const map = useMap();

  React.useEffect(() => {
    const myLayerGroup = L.layerGroup().addTo(map);

    if (!allFirestoreMarkers) return;
    allFirestoreMarkers.forEach((marker: any, key: any) => {
      L.geoJSON(marker, {
        onEachFeature: (feature: any, layer: any) => {
          layer.bindPopup(generatePopupContent(feature));
          layer.on('click', () => console.log("MARKER CLICKETD"));
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
