import React, { useState } from "react";
import SuiSymbol from "../assets/sui-symbol.png";

const Post = ({ jobPosting, width }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePostClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div
      className="post m-0.5 flex aspect-square flex-col justify-between rounded-3xl p-2.5 text-white relative truncate text-xl"
      style={{ width: `${width}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePostClick}
    >
      <div
        className="post-background absolute bg-cover bg-center top-0 left-0 w-full h-full rounded-3xl"
        style={{
          backgroundImage: `url(${jobPosting.background})`,
          filter: isHovered ? "brightness(50%)" : "brightness(100%)",
        }}
      ></div>
      {isHovered && (
        <div className="post-content absolute z-10 top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white cursor-pointer">
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
      {isPopupOpen && ( // Render popup if isPopupOpen is true
        <div className="popup fixed top-0 left-0 z-20 w-full h-full flex justify-center items-center bg-lightbox bg-cover">
          {/* Popup content */}
          <div className="popup-container w-3/6 h-2/6 bg-white">
            <button className="close-button" onClick={handlePostClick}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
