import React from 'react';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';

const Home = () => {
  return (
    <div className='home w-screen h-screen font-anton bg-cover bg-top bg-no-repeat bg-darkblue'>
      <Navbar />
      <Gallery />
    </div>
  )
}

export default Home
