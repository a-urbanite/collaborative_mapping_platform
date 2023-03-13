import { documentId, getDocs, query, updateDoc, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
// import { collRef } from '../../firebase-config';
import { deleteDoc, getDoc } from 'firebase/firestore';
import { db, collRef, firestore } from "../../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    // const marker = req.body
    const markerId = req.body.properties.markerId
    // const docRef = doc(db, "markers1", "5yKb6AuJxjXeHodUVEjy");
    const q = query(collRef, where('properties.markerId', '==', markerId));
    const querySnapshot = await getDocs(q)
    // const docSnapshot = querySnapshot.docs[0];
    const docRef = querySnapshot.docs[0].ref;
    // const queriedDoc = querySnapshot.docs[0].data()
    // console.log("DOCREF", docRef)
    await deleteDoc(docRef)
    // console.log(req.body)
    // const documentRef = firebase.firestore().collection('your-collection').doc(documentId);
    // const documentRef = collRef.doc(documentId);
    // const resp = await getDocs(collRef);
    // const locations: any[] = resp.docs.map((doc) => {
    //     const feature = doc.data()
    //     feature.properties.firebaseDocID = doc.id
    //     return feature
    // })
    res.status(200).json({message: "all good"})
  } catch (err) {
    res.status(500)
    res.json(err)
  }
}

export default handler;