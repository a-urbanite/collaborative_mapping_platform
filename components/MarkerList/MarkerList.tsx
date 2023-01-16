import React from "react";
import { useDrawingContext } from "../DrawingContext";
import { useMapRefContext } from "../MapRefContext";

const MarkerList = () => {
  const drawnMarkers = useDrawingContext().getDrawnMarkers();
  const mapInstance = useMapRefContext().getMapInstance()

  const highlightMarker = (marker: any) => {
    console.log(marker)
    // marker.setIcon(bigIcon);
    mapInstance.panTo(marker.getLatLng());
  };

  return (
    <div>
      <ul>
        {drawnMarkers.map((marker: any, i: any) => {
          // console.log(marker)
          return (
            <li
              key={i}
              onMouseOver={(e) => {
                // console.log("hover!");
                highlightMarker(marker)
              }}
            >
              Feature {i + 1}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MarkerList;
