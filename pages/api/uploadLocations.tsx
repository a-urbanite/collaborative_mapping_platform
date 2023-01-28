import { addDoc, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbRef } from '../../firebase-config';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const geoJsonArr: any[] = [];
    await req.body.forEach( async (str: string) => {
      const geoJsonStr = JSON.parse(str)
      await addDoc(dbRef, { feature: geoJsonStr })
      geoJsonArr.push(geoJsonStr)
    })
    res.status(200)
    res.end()
  } catch (err) {
    res.status(500)
    res.json(err)
  }
}

export default handler;