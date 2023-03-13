import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app"
import { getFirestore, collection } from 'firebase/firestore' 
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIRESTORE_API_KEY}`,
  authDomain: "collab-mapping.firebaseapp.com",
  projectId: "collab-mapping",
  storageBucket: "collab-mapping.appspot.com",
  messagingSenderId: "726487492648",
  appId: "1:726487492648:web:1fe5eee7c201f012bd6d1d"
};

// import firebase from 'firebase';

// Initialize Firebase
// const firebaseConfig = {
//   // Your Firebase project config here
// };
// firebase.initializeApp(firebaseConfig);

export const firestore = initializeApp(firebaseConfig);
export const db = getFirestore(firestore);
export const collRef = collection(db, "markers1");
export const auth = getAuth(firestore);
// export const provider = new GoogleAuthProvider();