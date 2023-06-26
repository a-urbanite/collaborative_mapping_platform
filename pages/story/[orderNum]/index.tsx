import React from 'react'
import { useRouter } from "next/router";
import { useMarkerContext } from '../../../components/Map/MarkerContext';

const Index = () => {
  const router = useRouter();
  const { findMarkerByOrderNum, allMarkers } = useMarkerContext();

  React.useEffect(() => {
    const orderNum = Number(router.query.orderNum);
    const marker = findMarkerByOrderNum(allMarkers, orderNum);
    if (marker) {
      const urlTitle = marker.properties.popupContent.title.replace(" ","_")
      router.push(`/${orderNum}/${urlTitle}`)
      console.log("inside IF ")
    } else {
      router.push("/nooooo")
    }
    // router.push("test")
  }, [router.isReady]);

  return (
    <div>index</div>
  )
}

export default Index