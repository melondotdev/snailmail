import React from 'react'
import { getAuth, signOut } from "firebase/auth";
import * as FaIcons from "react-icons/fa";

const Signout = () => {
  const auth = getAuth();
  
  const handleSignoutClick = () => {
    signOut(auth).then(() => {
      console.log("Signed Out");
      window.location.href = window.location.origin;
      // Sign-out successful.
    }).catch((error) => {
      console.log(error);
      // An error happened.
    });
  }
  
  return (
    <div className='sign-out flex items-center text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-ssblue hover:text-black' onClick={handleSignoutClick}>
      <FaIcons.FaDoorOpen className='mr-2'/>
      Sign Out
    </div>
  )
}

export default Signout
