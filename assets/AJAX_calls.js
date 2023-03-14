  //called in home
  // const fetchAllFirestoreMarkers = () => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let markers;
  //       // console.log("HOST URL: ", process.env.NEXT_PUBLIC_HOST_URL)
  //       let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/locations`);
  //       markers = await res.json();
  //       // console.log("SERVERRES FROM MARKERFETCH: ", markers)
  //       markers.forEach((marker) => {
  //         marker.geometry.coordinates = deserializeGeoJsonCoords(marker);
  //         marker.properties.operationIndicator = null;
  //       });
  //       setAllFirestoreMarkers(markers);
  //       resolve();
  //     } catch (err) {
  //       console.error(err);
  //       reject(err);
  //     }
  //   });
  // };

  

  // const removeFirestoreMarker = async (marker) => {
  //   console.log("MARKER", marker);
  //   try {
  //     let res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/deleteLocation`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(marker),
  //     });
  //     res = await res.json();
  //     return res;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };