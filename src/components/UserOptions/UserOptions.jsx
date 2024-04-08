import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import Signout from '../Auth/Signout';
import Profile from './Profile';
import ConnectWallet from './ConnectWallet';
import CreateJobPost from './CreateJobPost';

const UserOptions = ({ isWalletConnected, setIsEditProfile, setIsMintJobPost }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='relative inline-block text-left mt-2'>
      <button
        type="button"
        className="text-2xl mx-4 hover:text-ssblue ease-in-out duration-300 cursor-pointer items-center"
        onClick={handleMenuClick}
      >
        <FaIcons.FaBars />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="none">
            <Profile setIsEditProfile={setIsEditProfile} setIsMenuOpen={setIsMenuOpen} />
            <ConnectWallet setIsMenuOpen={setIsMenuOpen} />
            {isWalletConnected && (
              <CreateJobPost setIsMintJobPost={setIsMintJobPost} setIsMenuOpen={setIsMenuOpen} />
            )}
            <Signout />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOptions;
