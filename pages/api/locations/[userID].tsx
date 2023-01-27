import { getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbRef } from "../../../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userID } = req.query;

  const resp = await getDocs(dbRef);
  const locations: any[] = resp.docs.map((doc) => {
    const data = doc.data();
    const geojsonObj = JSON.parse(data.feature);
    geojsonObj.properties.firebaseDocID = doc.id;
    return geojsonObj;
  });

  const mylocations = locations.filter(
    (location: { properties: { user: { uid: any }} }) => location.properties.user.uid === userID
    );
    
  res.status(200).json(mylocations);
};

export default handler;
