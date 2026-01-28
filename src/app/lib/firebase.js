// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQstcOcRmlNU9sQhGTIQGZB2LolOkJMDg",
  authDomain: "staffcore-em.firebaseapp.com",
  projectId: "staffcore-em",
  storageBucket: "staffcore-em.firebasestorage.app",
  messagingSenderId: "205025730587",
  appId: "1:205025730587:web:9ac77f5f2b5d1fc82718be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
