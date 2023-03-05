import 'firebase/firestore';
import { addDoc, updateDoc, doc, setDoc, where, query, getDoc, getDocs, limit } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db, collRef } from "../../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const markersArr = JSON.parse(req.body);
    // console.log("MARKERSARR", req.body);
    const markersArr = req.body.map((str: string) => JSON.parse(str))
    // console.log(markersArr)

    const newlyDrawnMarkers = markersArr.filter(
      (marker: { properties: { operationIndicator: string } }) =>
        marker.properties.operationIndicator === "drawn in current session"
    );

    newlyDrawnMarkers.forEach(async (newlyDrawnMarker: any) => {
      newlyDrawnMarker.properties.operationIndicator === null
      await addDoc(collRef, newlyDrawnMarker);
    });

    const updatedDrawnMarkers = markersArr.filter(
      (marker: { properties: { operationIndicator: string } }) =>
        marker.properties.operationIndicator === "updated in current session"
    );

    updatedDrawnMarkers.forEach(async (updatedMarker: any) => {
      updatedMarker.properties.operationIndicator === null
      // console.log("updateMarker: ", updatedMarker)
      const markerId = updatedMarker.properties.markerId
      // const docRef = doc(db, "markers1", "5yKb6AuJxjXeHodUVEjy");
      const q = query(collRef, where('properties.markerId', '==', markerId));
      const querySnapshot = await getDocs(q)
      const docSnapshot = querySnapshot.docs[0];
      const docRef = docSnapshot.ref;
      // const queriedDoc = querySnapshot.docs[0].data()
      // console.log("DOCREF", docRef)
      await updateDoc(docRef, updatedMarker)
    });



    res.status(200);
    res.json({ res: "all good" });
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

export default handler;
