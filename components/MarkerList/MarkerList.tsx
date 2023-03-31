import React, { useEffect } from "react";
import { useMapContext } from "../MapContext";
import MarkerCard from "./MarkerCard/MarkerCard";
import UploadButton from "./UploadButton/UploadButton";
import styles from "./markerList.module.scss"
import { useFireStoreContext } from "../FireStoreContext";

const MarkerList = () => {
  const { userFirestoreMarkers } = useFireStoreContext();

  useEffect(() => {
    console.log("usermarkers", userFirestoreMarkers)
  }, [userFirestoreMarkers])
  
  console.log("HERE", Array.from(userFirestoreMarkers, ([name, value]) => ({ name, value })))

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {/* <li>asadsadsad</li> */}
        {/* Object.values(userFirestoreMarkers).map((marker) */}
        {Array.from(userFirestoreMarkers, ([name, value]) => ({ name, value })).map((marker: any, index) => {
          console.log("dsasadsasad", marker.value)
          if (marker.value.properties.operationIndicator !== "deleted in current session") {
            console.log("inside loopy loop", marker.value)
            // console.log("key", key)
            // return <li key={index}>asadsadsad</li>

            return <MarkerCard key={index} marker={marker.value}/>
          }
          })}
      </ul>
      {userFirestoreMarkers.length > 0 && <UploadButton/>}
    </div>
  );
};

export default MarkerList;
