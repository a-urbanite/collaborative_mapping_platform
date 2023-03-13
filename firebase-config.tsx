import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore' 
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIRESTORE_API_KEY}`,
  authDomain: "collab-mapping.firebaseapp.com",
  projectId: "collab-mapping",
  storageBucket: "collab-mapping.appspot.com",
  messagingSenderId: "726487492648",
  appId: "1:726487492648:web:1fe5eee7c201f012bd6d1d"
};

export const firebaseapp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseapp);
export const collRef = collection(firestore, "markers1");
export const auth = getAuth(firebaseapp);