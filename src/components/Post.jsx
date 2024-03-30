import React, { useState, useEffect } from "react";
import { Tooltip } from 'react-tooltip'
import SuiSymbol from "../assets/sui-symbol.png";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

const Post = ({ jobPosting, width }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [reportMessageOpacity, setReportMessageOpacity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discordUsername: '',
    twitterProfile: '',
    portfolioLink: '',
    aboutYourself: '',
    qualification: ''
  });
  const imageURL = jobPosting.imageURL;

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
  
  const handleApplyClick = () => {
    setIsApplied(!isApplied);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  
  const handleReportClick = () => {
    setIsReported(true);
    setReportMessageOpacity(1); // Immediately show the message with full opacity
  
    // Begin fade-out after 3 seconds
    setTimeout(() => {
      setReportMessageOpacity(0); // Fade out the message
    }, 0);
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
        <div className="popup fixed top-0 left-0 z-10 w-full h-full">
          <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={handlePostClick}></div>
          {/* Popup content */}
          <div className="popup-container absolute w-4/6 h-4/6 bg-gray-950 rounded-3xl flex flex-col z-40" style={{top: "10%", left: "15%"}}>
            <div className="post-image w-full h-10 bg-cover bg-center top-0 left-0 z-30 rounded-t-3xl" style={{
              backgroundImage: `url(${imageURL})`
            }}></div>
            <div className="post-info flex items-end">
              <div className="post-title mt-4 ml-4 text-2xl text-wrap">{jobPosting.title}</div>
              <div className="post-tags mx-2 flex align-center justify-left flex-wrap">
                <div className="post-tag rounded-3xl px-2 bg-lightgrey text-base text-faded">{jobPosting.category}</div>
              </div>
            </div>
            <div className="info-container flex justify-between">
              <div className="company-info mt-2 mx-4 text-base font-inter flex items-center">
                {jobPosting.company} • ☆ {jobPosting.companyRating.toFixed(1)} 
                <span className="rating-number opacity-50 ml-1" data-tooltip-id="ratings-tooltip" data-tooltip-content="Reviews">{` (${jobPosting.companyNumberofRatings})`}</span>
                <Tooltip id="ratings-tooltip" />
                <a
                  href={`mailto:${jobPosting.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="email-link ml-2"
                ><MdIcons.MdEmail /></a>
                <a
                  href={jobPosting.discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="discord-link ml-2"
                ><FaIcons.FaDiscord /></a>
                <a
                  href={jobPosting.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="twitter-link ml-2"
                ><FaIcons.FaTwitter /></a>
              </div>
              <div className="post-date-container flex items-end mr-6 opacity-80">
                <FaIcons.FaRegCalendarAlt /><span className="posting-date ml-1 text-sm font-inter">{jobPosting.datePosted}</span>
              </div>
            </div>
            <hr className="line opacity-20 w-11/12 mt-2 mx-4" />
            {(isApplied === false) ? (
              <div className="description-action-container h-4/5">
                <div className="post-description-container relative mt-4 mx-4 h-full overflow-y-auto">
                  <h1 className="post-description-title font-inter text-lg font-bold">Job Description</h1>
                  <div className="post-description text-sm font-inter text-wrap">
                    {jobPosting.description.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="post-actions flex justify-center items-center mt-1">
                  <button className="apply flex items-center font-inter text-base m-4 py-1 px-2 border-2 rounded-3xl hover:bg-darkishblue ease-in-out duration-300" onClick={handleApplyClick}><FaIcons.FaCheck /><span className="ml-1">Apply Now</span></button>
                  <button className="report flex items-center font-inter text-base m-4 py-1 px-2 border-2 rounded-3xl hover:bg-darkishblue ease-in-out duration-300" onClick={handleReportClick}><FaIcons.FaFlag /><span className="ml-1">Report Job</span></button>
                </div>
              </div>
            ) : (
              <div className="description-action-container h-4/5">
                <div className="post-description-container relative mt-4 mx-4 h-full">
                  <h1 className="post-description-title font-inter text-lg font-bold mb-2">Application Form</h1>
                  <form className="form-container flex flex-col text-black font-inter">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="form-input"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="discordUsername"
                      value={formData.discordUsername}
                      onChange={handleInputChange}
                      placeholder="Discord Username"
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="twitterProfile"
                      value={formData.twitterProfile}
                      onChange={handleInputChange}
                      placeholder="Twitter Profile"
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleInputChange}
                      placeholder="Link to Portfolio"
                      className="form-input"
                    />
                    <textarea
                      name="aboutYourself"
                      value={formData.aboutYourself}
                      onChange={handleInputChange}
                      placeholder="Tell me about yourself"
                      className="form-textarea"
                    ></textarea>
                    <textarea
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="Why are you qualified for this role?"
                      className="form-textarea"
                    ></textarea>
                    <div className="post-actions flex justify-center items-center mt-1">
                      <button type="button" className="apply flex items-center font-inter text-base text-white m-4 py-1 px-2 border-2 rounded-3xl hover:bg-darkishblue ease-in-out duration-300" onClick={handleApplyClick}><MdIcons.MdArrowBack /><span className="ml-1">Back</span></button>
                      <button type="submit" className="report flex items-center font-inter text-base text-white m-4 py-1 px-2 border-2 rounded-3xl hover:bg-darkishblue ease-in-out duration-300"><FaIcons.FaCheck /><span className="ml-1">Submit</span></button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {isReported && (
              <div 
                className={`report-response fixed z-20 top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-80 bg-black text-white`} 
                style={{opacity: reportMessageOpacity, transition: 'opacity 3s ease-in-out'}}>
                Thank you for submitting a report!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
