import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import { ethos, EthosConnectStatus } from 'ethos-connect';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery/Gallery';
import EditProfile from "../components/PopUps/EditProfile";
import MintJobPost from '../components/PopUps/MintJobPost.tsx';
import fetchUserData from '../components/Auth/FetchUserData.jsx';
import fetchWalletData from '../components/Auth/FetchWalletData.jsx';

const Home = () => {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [uid, setUid] = useState('');
  const [userData, setUserData] = useState('');
  const [walletData, setWalletData] = useState({});
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isMintJobPost, setIsMintJobPost] = useState(false);
  
  // Fetch Data from Firebase (note: security rules limit reading to user's own documents)
  
  const auth = getAuth();
  
  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          setUid(user.uid);
          const userDataSnapshot = await fetchUserData(uid);
          setUserData(userDataSnapshot);
          if (userData.empty) {
            await addDoc(collection(db, "users"), {
              uid: uid,
              name: "Example",
              about: "Example About Me",
              email: "example@gmail.com",
              portfolio: "example.com",
              discord: "example",
              twitter: "@example",
            });
            const updatedUserData = await fetchUserData(uid);
            setUserData(updatedUserData);
          }
        } else {
          // User is signed out
        }
      });
    };
  
    fetchDataAndUpdateState();
  }, [auth, userData.empty, uid]);  

  // Listener for being authenticated with Firebase

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
  
  // Save data to firebase user doc
  
  const saveData = async (formChanges) => {
    if (!userData.empty) {
      // Log formChanges and userData to debug
      console.log("Form Changes:", formChanges);
      console.log("User Data:", userData.docs[0].data());
  
      const docRef = userData.docs[0].ref;
      const updates = {};
  
      // Iterate through formChanges to see which fields were updated
      Object.keys(formChanges).forEach((key) => {
        if (formChanges[key]) {
          updates[key] = formChanges[key];
        }
      });
  
      // Log updates to verify which fields will be updated
      console.log("Updates:", updates);
  
      try {
        if (Object.keys(updates).length > 0) {
          await updateDoc(docRef, updates);
          console.log("Updated sections saved successfully.");
          const userDataSnapshot = await fetchUserData(uid);
          setUserData(userDataSnapshot);
        } else {
          console.log("No changes to save.");
        }
      } catch (error) {
        console.error("Error saving responses:", error);
      }
    } else {
      console.log("No document found for the current user.");
    }
  };
  
  // Listener for wallet connection status
  
  const { wallet, status } = ethos.useWallet();
  
  useEffect(() => {
    const checkWalletConnectionStatus = async () => {
      if (status === EthosConnectStatus.Connected) {
        setIsWalletConnected(true);
        try {
          const walletDataSnapshot = await fetchWalletData(wallet);
          setWalletData(walletDataSnapshot);
        } catch (error) {
          console.log("Error fetching wallet data:", error);
        }
      } else {
        setIsWalletConnected(false);
      }
    }
    
    checkWalletConnectionStatus();
  }, [wallet, status]);
  
  return (
    <div className='home w-screen h-screen font-anton bg-cover bg-top bg-no-repeat bg-darkblue'>
      <Navbar isLoggedIn={isLoggedIn} walletData={walletData} isWalletConnected={isWalletConnected} setIsEditProfile={setIsEditProfile} setIsMintJobPost={setIsMintJobPost} />
      <Gallery isLoggedIn={isLoggedIn} userData={userData} />
      {isEditProfile && (
        <EditProfile 
          userData={userData} 
          isEditProfile={isEditProfile} 
          setIsEditProfile={setIsEditProfile} 
          saveData={saveData}
        />
      )}
      {isMintJobPost && (
        <MintJobPost setIsMintJobPost={setIsMintJobPost} />
      )}
    </div>
  )
}

export default Home;
