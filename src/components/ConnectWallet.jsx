import React from 'react'
import { SignInButton } from 'ethos-connect';
import { ethos, EthosConnectStatus } from "ethos-connect";
import * as FaIcons from "react-icons/fa";

const ConnectWallet = ({ setIsMenuOpen }) => {
  const { status } = ethos.useWallet();
  const { wallet } = ethos.useWallet();
  
  return (
    <div className='flex items-center text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-ssblue hover:text-black'>
      <FaIcons.FaWallet className='mr-2'/>
      {!(status === EthosConnectStatus.Connected) ? (
        <SignInButton onClick={() => setIsMenuOpen(false)}>
          Connect Wallet
        </SignInButton>
      ) : (
        <p onClick={() => { wallet.disconnect(); setIsMenuOpen(false); }}>Disconnect Wallet</p>
      )}
    </div>
  )
}

export default ConnectWallet
