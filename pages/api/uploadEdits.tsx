import 'firebase/firestore';
import { addDoc, updateDoc, doc, setDoc, where, query, getDoc, getDocs, limit, deleteDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { collRef, firestore } from "../../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    req.body.forEach(async (marker: any) => {

      if (marker.properties.operationIndicator === "created in current session") {
        marker.properties.operationIndicator = null
        await addDoc(collRef, marker);
      }

      if (["popup edited in current session", "updated in current session"].includes(marker.properties.operationIndicator)) {
        marker.properties.operationIndicator = null
        const markerId = marker.properties.markerId
        const q = query(collRef, where('properties.markerId', '==', markerId));
        const querySnapshot = await getDocs(q)
        // if it tries to update a marker that doesnt exists it means 
        // in the frontend the layer has been added and edited in the same session
        try {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, marker)
        } catch (error) {
          await addDoc(collRef, marker)
        }
      }

      if (marker.properties.operationIndicator === "deleted in current session") {
        await deleteDoc(doc(firestore, "markers1", marker.properties.firebaseDocID))
      }

    });

    res.status(200);
    res.json({ res: "all Edits uploaded" });
  } catch (err) {
    console.error(err)
    res.status(500);
    res.json(err);
  }
};

export default handler;
