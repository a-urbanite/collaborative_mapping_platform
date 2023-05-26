import React from "react";
import * as L from "leaflet";
import { useMarkerContext } from "./MarkerContext";

const MarkerGroup = ({ FGref, markers }: any) => {
  const { generatePopupContent, attachMapLayerObjToMarkerInHashmap, highlightMarkerCard } =
    useMarkerContext();

  React.useEffect(() => {
    const featureGroup = FGref.current;

    markers.forEach((marker: any) => {
      if (marker.properties.operationIndicator == "deleted in current session") return;
      L.geoJSON(marker, {
        onEachFeature: (feature: any, layer: any) => {
          layer.bindPopup(generatePopupContent(feature));
          layer.on("click", highlightMarkerCard);
          featureGroup.addLayer(layer);
          attachMapLayerObjToMarkerInHashmap(feature, layer, markers);
        },
      });
    });
    return () => {
      featureGroup.clearLayers();
    };
  }, [markers]);

  return <></>;
};

export default React.memo(MarkerGroup);
