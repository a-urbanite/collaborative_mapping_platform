// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore' 
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqzOkod5c-TEwntpYZYGMkKJ55qbM73HE",
  authDomain: "collab-mapping.firebaseapp.com",
  projectId: "collab-mapping",
  storageBucket: "collab-mapping.appspot.com",
  messagingSenderId: "726487492648",
  appId: "1:726487492648:web:1fe5eee7c201f012bd6d1d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const dbRef = collection(db, "markers1");
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();