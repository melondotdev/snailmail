import React, { useState, useEffect } from "react";
import Filter from "../Filter/Filter";
import Post from "../Post/Post";
import "./Gallery.css";

const Gallery = () => {
  // Listener for window width
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate dynamic item width
  
  const numItemsFitMaxWidth = Math.floor(windowWidth / 250);
  const dynamicItemWidth =
    windowWidth / numItemsFitMaxWidth > 251
      ? windowWidth / (numItemsFitMaxWidth + 1) + 10
      : windowWidth / numItemsFitMaxWidth + 10;
  
  const jobPostings = [
    {
      id: 1,
      category: "Graphics & Design",
      title: "Logo Design",
      background:
        "https://gifdb.com/images/high/light-trails-wave-background-r4tz04b0l8kqi6do.gif",
      datePosted: "March 28, 2024",
      reward: 20,
      rewardDenomination: "SUI"
    },
    {
      id: 2,
      category: "Graphics & Design",
      title: "Art Commission",
      background:
        "https://64.media.tumblr.com/e69d6558a943c0384cf9b6acf11bdcdb/tumblr_mgc4658blx1s2gn79o1_500.gif",
    },
    {
      id: 3,
      category: "Programming & Tech",
      title: "Staking Platform",
      background:
        "https://i.pinimg.com/originals/6b/d8/ef/6bd8ef35364c9672c7cbb4687977d3ee.gif",
    },
    {
      id: 4,
      category: "Digital Marketing",
      title: "Logo Design",
      background:
        "https://pa1.aminoapps.com/6742/6749ba759fb09d83419d0228a8ad009c864d231d_00.gif",
    },
    {
      id: 5,
      category: "Video & Animation",
      title: "Art Commission",
      background:
        "https://i.pinimg.com/originals/c7/12/2a/c7122acb9a6947777f7e3c59b17875ce.gif",
    },
    {
      id: 6,
      category: "Writing & Translation",
      title: "Staking Platform",
      background:
        "https://www.icegif.com/wp-content/uploads/2022/01/icegif-543.gif",
    },
  ];

  return (
    <div className="gallery">
      <div className="gallery-container">
        <Filter jobPostings={jobPostings} width={dynamicItemWidth} />
        {jobPostings.map((jobPosting) => (
          <Post
            key={jobPosting.id}
            jobPosting={jobPosting}
            width={dynamicItemWidth}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
