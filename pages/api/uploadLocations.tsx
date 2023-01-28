import { addDoc, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbRef } from "../../firebase-config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const geoJsonArr: any[] = [];
    await req.body.forEach(async (str: string) => {
      const geoJsonObj = JSON.parse(str);
      console.log("GEOJSONOBJ ready to fly: ", geoJsonObj);
      await addDoc(dbRef, geoJsonObj);
      geoJsonArr.push(geoJsonObj);
    });
    res.status(200);
    res.end();
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

export default handler;