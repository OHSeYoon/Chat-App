import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAA8o7VDKdDFQL91K1KNqopvyamFfbcPGU",
  authDomain: "study-51ca1.firebaseapp.com",
  projectId: "study-51ca1",
  storageBucket: "study-51ca1.appspot.com",
  messagingSenderId: "367840180624",
  appId: "1:367840180624:web:443649247c7138a07cdb15",
  measurementId: "G-52HN8G1XT0"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app)