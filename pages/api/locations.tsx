import { getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbRef } from '../../firebase-config';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const resp = await getDocs(dbRef);
    const locations: any[] = resp.docs.map((doc) => {
        const feature = doc.data()
        // console.log(feature)
        feature.properties.firebaseDocID = doc.id
        return feature
    })
    res.status(200).json(locations)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
}

export default handler;