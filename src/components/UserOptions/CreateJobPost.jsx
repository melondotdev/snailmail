import React from 'react'
import * as IoIcons from "react-icons/io";

const CreateJobPost = ({ setIsMintJobPost, setIsMenuOpen }) => {
  const handleMintClick = () => {
    setIsMintJobPost(true);
    setIsMenuOpen(false); // Close the menu
  }
  
  return (
    <div className="mint-job-post flex items-center text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-ssblue hover:text-black" onClick={handleMintClick}>
      <IoIcons.IoIosCreate className='mr-2'/>
      Mint Job Post
    </div>
  )
}

export default CreateJobPost
