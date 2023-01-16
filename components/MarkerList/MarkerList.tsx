import React from "react";
import { useDrawingContext } from "../DrawingContext";

import MarkerCard from "./MarkerCard/MarkerCard";

const MarkerList = () => {
  const drawnMarkers = useDrawingContext().getDrawnMarkers();




  return (
    <div>
      <ul>
        {drawnMarkers.map((marker: any, i: any) => {
          // console.log(marker)
          return <MarkerCard key={i} marker={marker} i={i}/>
        })}
      </ul>
    </div>
  );
};

export default MarkerList;
