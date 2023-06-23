import { getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { publicMarkerCollRef } from '../../firebase-config';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const resp = await getDocs(publicMarkerCollRef);
    // if (resp.docs.length === 0) throw new Error("server response contains no entries")
    const locations: any[] = resp.docs.map((doc) => {
        const feature = doc.data()
        feature.properties.firebaseDocID = doc.id
        return feature
    })
    res.status(200).json(locations)
  } catch (err: any) {
    res.status(500).json({ code: 500, message: err.message })
  }
}

export default handler;