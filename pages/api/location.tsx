import { getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { publicMarkerCollRef } from '../../firebase-config';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("single location request received")
    const queryParams = req.body
    console.log(queryParams)
    const orderNum = queryParams.orderNum
    const title = queryParams.title

    const q = query(publicMarkerCollRef, where('properties.orderNum', '==', orderNum));
    const resp = await getDocs(q)

    if (resp.docs.length === 0) throw new Error("server response contains no entries")
    if (resp.docs.length > 1) throw new Error("more than one entry with that orderNum")

    const feature = resp.docs[0].data()
    res.status(200).json(feature)

  } catch (err: any) {

    res.status(500).json({ code: 500, message: err.message })
  }
}

export default handler;