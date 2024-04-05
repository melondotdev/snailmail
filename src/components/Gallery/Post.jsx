import React, { useState, useEffect } from "react";
import SuiSymbol from "../../assets/sui-symbol.png";
import JobDescription from "../PopUps/JobDescription";

const Post = ({ jobPosting, isLoggedIn, width, userData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isReported, setIsReported] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const handlePostClick = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsApplied(false);
    setIsHovered(false);
  };
  
  useEffect(() => {
    let fadeOutTimer;
    if (isReported) {
      // Wait for the fade-out to complete before hiding the message
      fadeOutTimer = setTimeout(() => {
        setIsReported(false); // This will remove the message from the DOM
      }, 3000); // Assuming it takes 1 second for the fade-out transition
    }
    // Cleanup timer
    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, [isReported]); 
  
  return (
    <div
      className="post m-0.5 flex aspect-square flex-col justify-between rounded-3xl p-2.5 text-white relative truncate text-xl"
      style={{ width: `${width}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="post-background absolute bg-cover bg-center top-0 left-0 w-full h-full rounded-3xl"
        style={{
          backgroundImage: `url(${jobPosting.imageURL})`,
          filter: isHovered ? "brightness(50%)" : "brightness(100%)",
        }}
      ></div>
      {isHovered && (
        <div className="post-content absolute z-10 top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white cursor-pointer" onClick={handlePostClick}>
          {/* Content you want to show on hover */}
          <div className="post-title text-2xl text-center">{jobPosting.title}</div>
          <div className="post-company text-lg text-faded">By: {jobPosting.company}</div>
          <div className="post-tags pt-1 flex align-center justify-center flex-wrap">
            <div className="post-tag rounded-3xl m-0.5 px-3 bg-lightgrey text-base text-faded">{jobPosting.category}</div>
          </div>
          <div className="post-reward absolute bottom-0 right-0 mr-1 mb-1 flex justify-center items-center text-2xl">
            <img
              src={SuiSymbol}
              alt="sui-symbol"
              className="currency-symbol w-5"
            ></img>
            <span style={{ marginLeft: "6px" }}>{jobPosting.reward}</span>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <JobDescription 
          userData={userData}
          jobPosting={jobPosting}
          isLoggedIn={isLoggedIn}
          setIsHovered={setIsHovered}
          setIsPopupOpen={setIsPopupOpen}
          isPopupOpen={isPopupOpen} 
          setIsApplied={setIsApplied}
          isApplied={isApplied}
        />
      )}
    </div>
  );
};

export default Post;
