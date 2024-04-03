// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  // authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  // projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  // storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  // messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
  // appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
  // measurementId: `${process.env.REACT_APP_MEASUREMENT_ID}`,
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