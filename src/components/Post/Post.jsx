import React, { useState } from "react";
import "./Post.css";

const Post = ({ jobPosting, width }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="post"
      style={{ width: `${width}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          {jobPosting.title}
        </div>
      )}
    </div>
  );
};

export default Post;
