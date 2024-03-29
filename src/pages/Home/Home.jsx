import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Gallery from '../../components/Gallery/Gallery';
import './Home.css';

const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      <Gallery />
    </div>
  )
}

export default Home
