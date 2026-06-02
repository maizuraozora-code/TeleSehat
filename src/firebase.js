import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKvZxkYA2LoUt0CPsF-nyRL9ej3R9Erks",
  authDomain: "telesehat-20860.firebaseapp.com",
  projectId: "telesehat-20860",
  storageBucket: "telesehat-20860.firebasestorage.app",
  messagingSenderId: "605151104294",
  appId: "1:605151104294:web:f109cd0d82ad47316b85e7",
  measurementId: "G-3T4GR4LVH7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
