import React from "react";
import * as L from "leaflet";
import { useMarkerContext } from "../MarkerContext";
import { useRouter } from "next/router";

const MarkerGroup = ({ FGref }: any) => {
  const {
    allMarkers,
    userMarkers,
    generatePopupContent,
    attachMapLayerObjToMarkerInHashmap,
    highlightMarkerCard,
  } = useMarkerContext();
  const router = useRouter();

  const currentMarkerSet = router.pathname === "/home" ? allMarkers : userMarkers

  React.useEffect(() => {

    const featureGroup = FGref.current

    currentMarkerSet.forEach((marker: any) => {
      if (marker.properties.operationIndicator == "deleted in current session") return;
      L.geoJSON(marker, {
        onEachFeature: (feature: any, layer: any) => {
          layer.bindPopup(generatePopupContent(feature));
          layer.on("click", highlightMarkerCard);
          featureGroup.addLayer(layer);
          attachMapLayerObjToMarkerInHashmap(feature, layer, currentMarkerSet);
        },
      });
    });
    return () => {
      featureGroup.clearLayers();
    };

  }, [allMarkers, userMarkers]);

  return <></>;
};

export default React.memo(MarkerGroup);
