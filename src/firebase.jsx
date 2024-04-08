// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN77QLC0wHPz03d757xaAWfQM8i3_K89A",
  authDomain: "sui-snails-lanc.firebaseapp.com",
  projectId: "sui-snails-lanc",
  storageBucket: "sui-snails-lanc.appspot.com",
  messagingSenderId: "615745150584",
  appId: "1:615745150584:web:accf69a4648f26e8b4978d",
  measurementId: "G-E1BT036ERL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};