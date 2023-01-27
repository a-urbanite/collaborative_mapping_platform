import { getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbRef } from '../../../firebase-config';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await getDocs(dbRef);
  const locations: any[] = resp.docs.map((doc) => {
      const data = doc.data()
      const geojsonObj = JSON.parse(data.feature)
      geojsonObj.properties.firebaseDocID = doc.id
      return geojsonObj
  })
  res.status(200).json(locations)
}

export default handler;