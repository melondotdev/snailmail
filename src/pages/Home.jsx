import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <div className='home w-screen h-screen font-anton bg-cover bg-top bg-no-repeat bg-darkblue'>
      <Navbar setWalletAddress={setWalletAddress} />
      <Gallery walletAddress={walletAddress}/>
    </div>
  )
}

export default Home
