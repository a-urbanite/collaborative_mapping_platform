import { doc, documentId, getDocs, query, updateDoc, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
// import { collRef } from '../../firebase-config';
import { deleteDoc } from 'firebase/firestore';
import { firestore } from "../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const docRef = doc(firestore, "markers1", req.body.properties.firebaseDocID);
    await deleteDoc(docRef)

    res.status(200).json({message: "marker deleted"})
  } catch (err) {
    res.status(500)
    res.json(err)
  }
}

export default handler;