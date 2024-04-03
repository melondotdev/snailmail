import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  updateDoc,
} from "@firebase/firestore";
import Login from "./Auth/Login";
import UserOptions from "./UserOptions";
import EditProfile from "./EditProfile";
import fetchData from '../components/FetchData';

const Navbar = ({ isLoggedIn, uid, userData, setUserData }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
          const userDataSnapshot = await fetchData(uid);
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
  
  
  return (
    <div className="navbar flex justify-between items-center h-20 font-anton bg-transparent text-white z-10">
      <Link to="/">
        <div className="navbar-left flex items-center ml-4 text-3xl">
          <span className="text-white">SUI</span>
          <span className="text-ssblue">SNAILS</span>
          <span className="text-white ml-2">LANCER</span>
        </div>
      </Link>
      <div className="navbar-right mr-4 flex">
        {!isLoggedIn ? (
            <Login />
          ) : (
            <UserOptions setIsPopupOpen={setIsPopupOpen} />
          )
        }
      </div>
      {isPopupOpen && (
        <EditProfile 
          userData={userData} 
          setIsPopupOpen={setIsPopupOpen} 
          isPopupOpen={isPopupOpen} 
          saveData={saveData}
        />
      )}
    </div>
  );
};

export default Navbar;
