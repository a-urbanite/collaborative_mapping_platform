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

  // let currentMarkerSet: any;
  // switch (router.pathname) {
  //   case "/home":
  //     currentMarkerSet = allMarkers
  //     break;
  //   case "/myPlaces":
  //     currentMarkerSet = userMarkers
  //     break;
  //   case "/contribute":
  //     currentMarkerSet = userMarkers
  //     break;
  // }

  const currentMarkerSet = router.pathname === "/home" ? allMarkers : userMarkers

  React.useEffect(() => {
    // console.log("insie useeffect")

    const featureGroup = FGref.current
    // if (featureGroup.getLayers().length !== 0) {
    //   console.log("triggered failsafe")
    //   return};

    currentMarkerSet.forEach((marker: any) => {
      // console.log("MERKER ITERATOR STERTET")
      if (marker.properties.operationIndicator == "deleted in current session") return;
      L.geoJSON(marker, {
        onEachFeature: (feature: any, layer: any) => {
          // console.log("feature::::", feature)
          layer.bindPopup(generatePopupContent(feature));
          // console.log("dsfdsfdsfsfdsf")
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
