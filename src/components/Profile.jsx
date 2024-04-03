import React from 'react';
import * as MdIcons from "react-icons/md";

const Profile = ({ setIsPopupOpen, setIsMenuOpen }) => {
  
  const editProfile = () => {
    setIsPopupOpen(true);
    setIsMenuOpen(false); // Close the menu
  }
  
  return (
    <div className="profile flex items-center text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-ssblue hover:text-black" onClick={editProfile}>
      <MdIcons.MdPerson className='mr-2'/>
      Edit Profile
    </div>
  )
}

export default Profile;
