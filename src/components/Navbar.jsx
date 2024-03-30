import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ethos } from 'ethos-connect'

const Navbar = ({ setWalletAddress }) => {
  const { wallet } = ethos.useWallet();

  useEffect(() => {
    if (wallet?.address) {
      setWalletAddress(wallet.address);
    }
  }, [wallet?.address, setWalletAddress]);
  
  return (
    <div className="navbar flex justify-between items-center h-20 font-anton bg-transparent text-white z-10">
      <Link to="/">
        <div className="navbar-left flex items-center ml-4 text-3xl">
          <span className="text-white">SUI</span>
          <span className="text-ssblue">SNAILS</span>
          <span className="text-white ml-2">LANCER</span>
        </div>
      </Link>
      <div className="navbar-right mr-4 font-inter">
        <ethos.components.AddressWidget 
          excludeButtons={[
            ethos.enums.AddressWidgetButtons.CopyWalletAddress,
            ethos.enums.AddressWidgetButtons.WalletExplorer
          ]} 
        />
        {console.log(wallet?.address)}
      </div>
    </div>
  );
};

export default Navbar;
