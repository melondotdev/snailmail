import React, { useState } from "react";
import SuiSymbol from "../../assets/sui-symbol.png";
import "./Post.css";

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
      className="post"
      style={{ width: `${width}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePostClick}
    >
      <div
        className="post-background"
        style={{
          backgroundImage: `url(${jobPosting.background})`,
          filter: isHovered ? "brightness(50%)" : "brightness(100%)",
        }}
      ></div>
      {isHovered && (
        <div className="post-content">
          {/* Content you want to show on hover */}
          <div className="post-title">{jobPosting.title}</div>
          <div className="post-company">By: {jobPosting.company}</div>
          <div className="post-tags">
            <div className="post-tag">{jobPosting.category}</div>
            <div className="post-tag">{jobPosting.difficultyLevel}</div>
          </div>
          <div className="post-reward">
            <img
              src={SuiSymbol}
              alt="sui-symbol"
              className="currency-symbol"
            ></img>
            <span style={{ marginLeft: "6px" }}>{jobPosting.reward}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
