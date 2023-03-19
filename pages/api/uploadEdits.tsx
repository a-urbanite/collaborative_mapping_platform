import 'firebase/firestore';
import { addDoc, updateDoc, doc, setDoc, where, query, getDoc, getDocs, limit, deleteDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { collRef, firestore } from "../../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const markersArr = req.body.map((str: string) => JSON.parse(str))

    markersArr.forEach(async (marker: any) => {

      if (marker.properties.operationIndicator === "created in current session") {
        marker.properties.operationIndicator = null
        await addDoc(collRef, marker);
      }

      if (marker.properties.operationIndicator === "updated in current session") {
        marker.properties.operationIndicator = null
        const markerId = marker.properties.markerId
        const q = query(collRef, where('properties.markerId', '==', markerId));
        const querySnapshot = await getDocs(q)
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, marker)
      }

      if (marker.properties.operationIndicator === "deleted in current session") {
        await deleteDoc(doc(firestore, "markers1", marker.properties.firebaseDocID))
      }

    });

    res.status(200);
    res.json({ res: "all good" });
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

export default handler;
