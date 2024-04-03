import React, { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import { ethos } from 'ethos-connect';

const JobDescription = ({ userData, jobPosting, isLoggedIn, setIsHovered, setIsPopupOpen, isPopupOpen, setIsApplied, isApplied }) => {
  const [isReported, setIsReported] = useState(false);
  const [reportMessageOpacity, setReportMessageOpacity] = useState(1);
  const [formChanges, setFormChanges] = useState({});
  const imageURL = jobPosting.imageURL;
  const { wallet } = ethos.useWallet();
  
  const handlePostClick = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsApplied(false);
    setIsHovered(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormChanges(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleApplyClick = () => {
    setIsApplied(true);
  };
  
  const handleReportClick = () => {
    setIsReported(true);
    setReportMessageOpacity(1); // Immediately show the message with full opacity
  
    // Begin fade-out after 3 seconds
    setTimeout(() => {
      setReportMessageOpacity(0); // Fade out the message
    }, 0);

    setTimeout(() => {
      setIsReported(false);
    }, 2000)
  };
  
  const handleBackClick = () => {
    setIsApplied(false);
  };

  return (
    <div className="popup fixed top-0 left-0 z-10 w-full h-full">
      <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={handlePostClick}></div>
      {/* Popup content */}
      <div className="popup-container absolute w-4/6 h-4/6 bg-gray-800 rounded-3xl flex flex-col z-40" style={{top: "15%", left: "15%"}}>
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
          <div className="description-action-container h-4/5 flex flex-col justify-evenly">
            <div className="post-description-container relative py-4 mx-4 h-full overflow-y-auto">
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
            <div className="post-actions flex justify-center items-center">
              <button 
                className={`apply flex items-center font-inter text-base m-4 py-1 px-2 border-2 rounded-3xl hover:bg-darkishblue ease-in-out duration-300`} 
                onClick={handleApplyClick} 
                disabled={!isLoggedIn} 
                data-tooltip-id="can-apply" 
                data-tooltip-content="You have to login first!">
                <FaIcons.FaCheck /><span className="ml-1">Apply Now</span>
              </button>
                {!isLoggedIn && ( // Only render the Tooltip when the apply button is disabled
                  <Tooltip id="can-apply" place="top" effect="solid" className="font-inter">
                    You cannot apply because you have not logged in
                  </Tooltip>
                )}
              <button className="report flex items-center font-inter text-base m-4 py-1 px-2 border-2 rounded-3xl hover:bg-darkishblue ease-in-out duration-200" onClick={handleReportClick}><FaIcons.FaFlag /><span className="ml-1">Report Job</span></button>
            </div>
          </div>
        ) : (
          <div className="description-action-container h-4/5">
            <div className="post-description-container relative font-inter text-sm mt-4 mx-4 h-full">
              <h1 className="post-description-title font-inter text-lg font-bold mb-2">Application Form</h1>
              <form className="form-container flex flex-col h-5/6 justify-between">
                <div className="inputs flex flex-col text-white h-full text-wrap break-words">
                  <div>Name: {userData.docs[0].data().name}</div>
                  <div>About: {userData.docs[0].data().about}</div>
                  <div className='wallet-container'>
                    <span>Wallet: </span> 
                    <span>{wallet?.address.slice(0, 40)}{wallet?.address.length > 40 && '...'}</span>
                  </div>
                  <div>Email: {userData.docs[0].data().email}</div>
                  <div>Portfolio: {userData.docs[0].data().portfolio}</div>
                  <div>Discord: {userData.docs[0].data().discord}</div>
                  <div>Twitter: {userData.docs[0].data().twitter}</div>
                  <textarea
                    name="qualification"
                    value={formChanges.qualification}
                    onChange={handleInputChange}
                    placeholder="Why are you qualified for this role?"
                    className="form-textarea mt-4 p-1 h-full bg-black text-black"
                  ></textarea>
                </div>
                <div className="post-actions flex justify-center items-center mt-1">
                  <button type="button" className="apply flex items-center font-inter text-base text-white m-4 py-1 px-2 border-2 rounded-3xl hover:bg-darkishblue ease-in-out duration-300" onClick={handleBackClick}><MdIcons.MdArrowBack /><span className="ml-1">Back</span></button>
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
  )
}

export default JobDescription
