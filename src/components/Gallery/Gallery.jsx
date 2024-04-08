import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import Post from "./Post";
import fetchJobPostData from './fetchJobPostData';

const Gallery = ({ userData, isLoggedIn, jobPosts, refreshJobPosts }) => {
  
  // ===== Set correct size for job posts =====
  
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
      ? windowWidth / (numItemsFitMaxWidth + 1) - 5
      : windowWidth / numItemsFitMaxWidth - 5;

  // ===== Get Job Postings =====

  const [jobPostings, setJobPostings] = useState([
    {
      id: 1,
      category: "Graphics & Design",
      name: "Logo Design",
      image_url:
        "https://gifdb.com/images/high/light-trails-wave-background-r4tz04b0l8kqi6do.gif",
      datePosted: "March 28, 2024",
      reward: 100,
      rewardDenomination: "SUI",
      company: "Sui Snails",
      companyRating: 4.0,
      companyNumberofRatings: 143,
      description: `We are a start-up company in search of a talented and imaginative graphic designer to create a logo that incorporates our love for snails in an artistic and innovative way. Our brand values nature, sustainability, and creativity, and we wish to reflect these themes in our logo. 
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.`,
      email: "suisnailsnft@gmail.com",
      discord: "https://discord.gg/4RjEjQ5AcG",
      twitter: "https://twitter.com/suisnails",
    },
    {
      id: 2,
      category: "Graphics & Design",
      name: "Art Commission",
      company: "Sui Snails",
      description: `We are a start-up company in search of a talented and imaginative graphic designer to create a logo that incorporates our love for snails in an artistic and innovative way. Our brand values nature, sustainability, and creativity, and we wish to reflect these themes in our logo.`,
      companyRating: 4.0,
      companyNumberofRatings: 143,
      reward: 100,
      rewardDenomination: "SUI",
      image_url:
        "https://64.media.tumblr.com/e69d6558a943c0384cf9b6acf11bdcdb/tumblr_mgc4658blx1s2gn79o1_500.gif",
    },
    {
      id: 3,
      category: "Programming & Tech",
      name: "Staking Platform",
      company: "Sui Snails",
      companyRating: 4.0,
      companyNumberofRatings: 143,
      description: `We are a start-up company in search of a talented and imaginative graphic designer to create a logo that incorporates our love for snails in an artistic and innovative way. Our brand values nature, sustainability, and creativity, and we wish to reflect these themes in our logo.`,
      reward: 100,
      rewardDenomination: "SUI",
      image_url:
        "https://i.pinimg.com/originals/6b/d8/ef/6bd8ef35364c9672c7cbb4687977d3ee.gif",
    },
    {
      id: 4,
      category: "Digital Marketing",
      name: "Logo Design",
      company: "Sui Snails",
      companyRating: 4.0,
      companyNumberofRatings: 143,
      description: `We are a start-up company in search of a talented and imaginative graphic designer to create a logo that incorporates our love for snails in an artistic and innovative way. Our brand values nature, sustainability, and creativity, and we wish to reflect these themes in our logo.`,
      reward: 100,
      rewardDenomination: "SUI",
      difficultyLevel: "Medium",
      image_url:
        "https://pa1.aminoapps.com/6742/6749ba759fb09d83419d0228a8ad009c864d231d_00.gif",
    },
    {
      id: 5,
      category: "Video & Animation",
      name: "Art Commission",
      company: "Sui Snails",
      companyRating: 4.0,
      companyNumberofRatings: 143,
      description: `We are a start-up company in search of a talented and imaginative graphic designer to create a logo that incorporates our love for snails in an artistic and innovative way. Our brand values nature, sustainability, and creativity, and we wish to reflect these themes in our logo.`,
      reward: 100,
      rewardDenomination: "SUI",
      difficultyLevel: "Hard",
      image_url:
        "https://i.pinimg.com/originals/c7/12/2a/c7122acb9a6947777f7e3c59b17875ce.gif",
    },
    {
      id: 6,
      category: "Writing & Translation",
      name: "Staking Platform",
      company: "Sui Snails",
      companyRating: 4.0,
      companyNumberofRatings: 143,
      description: `We are a start-up company in search of a talented and imaginative graphic designer to create a logo that incorporates our love for snails in an artistic and innovative way. Our brand values nature, sustainability, and creativity, and we wish to reflect these themes in our logo.`,
      reward: 100,
      rewardDenomination: "SUI",
      difficultyLevel: "Easy",
      image_url:
        "https://www.icegif.com/wp-content/uploads/2022/01/icegif-543.gif",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchJobPostData();
        
        const processData = (dataArray) => {
          return dataArray.flat().map((item) => {
            if (item.data && item.data.object) {
              const displayData = item.data.object.display;
              const processedData = {};
              displayData.forEach((displayItem) => {
                processedData[displayItem.key] = displayItem.value;
              });
              return processedData;
            } else {
              return null; // or handle it according to your application's logic
            }
          }).filter(item => item !== null); // Filter out null items if necessary
        };
        
        const processedData = await processData(data);
        
        // Append new job postings to existing ones
        const updatedJobPostings = [...jobPostings, ...processedData];
        
        setJobPostings(updatedJobPostings);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="gallery justify-items-center">
      <div className="gallery-container flex flex-wrap">
        <Filter jobPostings={jobPostings} width={dynamicItemWidth} />
        {jobPostings.map((jobPosting) => (
          <Post
            key={jobPosting.id}
            isLoggedIn={isLoggedIn}
            jobPosting={jobPosting}
            width={dynamicItemWidth}
            userData={userData}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
