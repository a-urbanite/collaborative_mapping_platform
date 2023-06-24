import React from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { useMarkerContext } from "../../../../components/Map/MarkerContext";
import { FirestoreMarker } from "../../../../components/Types";
// import { useMarkerContext } from "../../../../components/Map/MarkerContext";

const StoryPage = () => {
  const router = useRouter();
  const { findMarkerByOrderNum, allMarkers } = useMarkerContext();
  const [currentMarker, setcurrentMarker] = React.useState(null as unknown as FirestoreMarker);

  // React.useEffect(() => {
  //   console.log("CurrentMarker: ", currentMarker)
  // }, [currentMarker])

  React.useEffect(() => {
    console.log("ALLMARKERS: ", allMarkers)
  }, [allMarkers])

  React.useEffect(() => {
    // console.log("Router", router.query.orderNum, router.query.title)
    const orderNum = Number(router.query.orderNum);
    // console.log(orderNum)
    const rawTitle = router.query.title as string;
    // console.log("RawTitle: ", rawTitle);
    // const title = rawTitle.replace("_", " ")
    // console.log("mapmarkers in page", allMarkers)
    const marker = findMarkerByOrderNum(allMarkers, orderNum);
    console.log("MAKRER Returned: ", marker)
    if (marker) {
      setcurrentMarker(marker.value);
    }
  }, [router.isReady, allMarkers]);

  return (
    <>
      <div>StoryPage</div>
      {<h2>{currentMarker.properties.popupContent.title}</h2>}
      {<p>{currentMarker.properties.popupContent.text}</p>}
      <button onClick={() => Router.push("/home")}>Back</button>
    </>
  );
};

export default StoryPage;
