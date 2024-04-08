import React from "react";
import { Link } from "react-router-dom";
import Login from "./Auth/Login";
import UserOptions from "./UserOptions/UserOptions";
import SuiSymbol from "../assets/sui-symbol.png";

const Navbar = ({ walletData, isLoggedIn, isWalletConnected, setIsEditProfile, setIsMintJobPost, refreshJobPosts }) => {
  const formatWalletAddress = (address) => {
    if (!address) return ''; // Return empty string if address is not provided
    const firstFour = address.substring(0, 4); // Extract first four characters
    const lastFour = address.substring(address.length - 4); // Extract last four characters
    return `${firstFour}...${lastFour}`; // Concatenate with "..." in the middle
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
            <React.Fragment>
              {isWalletConnected && (
                <div className="wallet-details flex font-inter items-center text-base bg-transparent mt-1">
                  <img src={SuiSymbol} alt='symbol' className="h-4 w-auto mr-1"></img>
                  <p className="mr-4">{(parseInt(walletData?.Balance || 0) / 1000000000).toFixed(2).toString()}</p>
                  <p>{formatWalletAddress(walletData?.Address)}</p>
                </div>
              )}
              <UserOptions isWalletConnected={isWalletConnected} setIsEditProfile={setIsEditProfile} setIsMintJobPost={setIsMintJobPost} refreshJobPosts={refreshJobPosts} />
            </React.Fragment>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
