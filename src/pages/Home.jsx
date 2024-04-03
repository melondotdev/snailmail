import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import {
  collection,
  addDoc
} from "@firebase/firestore";
import { db } from "../firebase";
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';
import fetchData from '../components/FetchData';

const Home = () => {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState('');
  const [userData, setUserData] = useState('');
  
  const auth = getAuth();
  
  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          const userDataSnapshot = await fetchData(user.uid);
          setUid(user.uid);
          setUserData(userDataSnapshot);
          if (userData.empty) {
            await addDoc(collection(db, "users"), {
              uid: user.uid,
              name: "Example",
              about: "Example About Me",
              email: "example@gmail.com",
              portfolio: "example.com",
              discord: "example",
              twitter: "@example",
            });
            const updatedUserData = await fetchData(user.uid);
            setUserData(updatedUserData);
          }
        } else {
          // User is signed out
        }
      });
    };
  
    fetchDataAndUpdateState();
  }, [auth, userData.empty]);  

  useEffect(() => {
    const checkEmailSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsLoggedIn(true);
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
        } catch (error) {
          console.error("Error signing in with email link:", error);
        }
      }
    };

    checkEmailSignIn();
  }, [auth, setIsLoggedIn]);

  return (
    <div className='home w-screen h-screen font-anton bg-cover bg-top bg-no-repeat bg-darkblue'>
      <Navbar isLoggedIn={isLoggedIn} uid={uid} userData={userData} setUserData={setUserData} />
      <Gallery isLoggedIn={isLoggedIn} userData={userData} />
    </div>
  )
}

export default Home;
