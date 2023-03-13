import { documentId, getDocs, query, updateDoc, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
// import { collRef } from '../../firebase-config';
import { deleteDoc, getDoc } from 'firebase/firestore';
import { db, collRef, firestore } from "../../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const docRef = doc(db, "markers1", "5yKb6AuJxjXeHodUVEjy");

    const markerId = req.body.properties.markerId
    const q = query(collRef, where('properties.markerId', '==', markerId));
    const querySnapshot = await getDocs(q)
    const docRef = querySnapshot.docs[0].ref;
    await deleteDoc(docRef)

    // const documentRef = firebase.firestore().collection('your-collection').doc(documentId);

    res.status(200).json({message: "all good"})
  } catch (err) {
    res.status(500)
    res.json(err)
  }
}

export default handler;