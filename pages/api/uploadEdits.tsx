import 'firebase/firestore';
import { addDoc, updateDoc, doc, setDoc, where, query, getDoc, getDocs, limit, deleteDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { publicMarkerCollRef, counterCollRef, firestore } from "../../firebase-config";
import { runTransaction } from "firebase/firestore";

const getOrderNum = async () => {

  // await runTransaction(db, async (transaction) => {
  //   const sfDoc = await transaction.get(sfDocRef);
  //   if (!sfDoc.exists()) {
  //     throw "Document does not exist!";
  //   }

  //   const newPopulation = sfDoc.data().population + 1;
  //   transaction.update(sfDocRef, { population: newPopulation });
  // });

  const q = query(counterCollRef);
  const querySnapshot = await getDocs(q)
  const docRef = querySnapshot.docs[0].ref;
  const docSnapshot = await getDoc(docRef)
  const data = docSnapshot.data();
  const lastNum = data!.value;
  const newNum = lastNum +1;
  await updateDoc(docRef, {value: newNum})
  return newNum

}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    req.body.forEach(async (marker: any) => {
      const status = marker.properties.operationIndicator;
      delete marker.properties.operationIndicator

      if (status === "created in current session") {

        const orderNum = await getOrderNum()
        console.log("ORDERNUM: ", orderNum)

        await addDoc(publicMarkerCollRef, marker);
      }

      if (["popup edited in current session", "updated in current session"].includes(status)) {
        const markerId = marker.properties.markerId
        const q = query(publicMarkerCollRef, where('properties.markerId', '==', markerId));
        const querySnapshot = await getDocs(q)
        // if it tries to update a marker that doesnt exists it means 
        // in the frontend the layer has been added and edited in the same session
        try {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, marker)
        } catch (error) {
          await addDoc(publicMarkerCollRef, marker)
        }
      }

      if (status === "deleted in current session") {
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
