import {
  doc,
  getDocs,
  deleteDoc,
  query,
  collection,
  runTransaction,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { counterCollRef, db } from "../../firebase-config";

const resetOrderNum = async () => {
  try {
    const q = query(counterCollRef);
    const querySnapshot = await getDocs(q);
    const docRef = querySnapshot.docs[0].ref;

    await runTransaction(db, async (transaction) => {
      transaction.update(docRef, { value: 0 });
    });
  } catch (error) {
    throw new Error("counter reset failed");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("delete all markers initiated");
  try {
    const querySnapshot = await getDocs(collection(db, "markers1"));
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, "markers1", document.id));
    });
    await resetOrderNum();

    res.status(200).json({ message: "all markers deleted" });
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

export default handler;
