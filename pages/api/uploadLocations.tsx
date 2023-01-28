import { getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbRef } from '../../firebase-config';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body)
}

export default handler;