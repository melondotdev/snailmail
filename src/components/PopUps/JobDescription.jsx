import React, { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as TbIcons from "react-icons/tb";
import { ethos } from 'ethos-connect';
import emailjs from '@emailjs/browser';

const JobDescription = ({ userData, jobPosting, isLoggedIn, setIsHovered, setIsPopupOpen, isPopupOpen, setIsApplied, isApplied }) => {
  const [isReported, setIsReported] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  
  const handleSubmitClick = (e) => {
    e.preventDefault();

    const templateParams = {
      company: jobPosting.company,
      companyEmail: jobPosting.email,
      title: jobPosting.name,
      name: userData.docs[0].data().name,
      email: userData.docs[0].data().email,
      discord: userData.docs[0].data().discord,
      twitter: userData.docs[0].data().twitter,
      portfolio: userData.docs[0].data().portfolio,
      about: userData.docs[0].data().about,
      qualification: formChanges.qualification,
    };

    emailjs.init({
      publicKey: '6EG3ocdIGacZfBqQu',
      // Do not allow headless browsers
      blockHeadless: true,
      blockList: {
        // The variable contains the email address
        watchVariable: 'userEmail',
      },
      limitRate: {
        // Set the limit rate for the application
        id: 'app',
        // Allow 1 request per 10s
        throttle: 10000,
      },
    });

    emailjs
      .send('service_m55i096', 'template_hmoaaxu', templateParams).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
          console.log('FAILED...', error);
        },
      );

    setIsSubmitted(true);
        
    setTimeout(() => {
      setReportMessageOpacity(0); // Fade out the message
    }, 0);
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 8000)
  }
  
  return (
    <div className="popup fixed top-0 left-0 z-10 w-full h-full">
      <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={handlePostClick}></div>
      {/* Popup content */}
      <div className="popup-container absolute w-4/6 h-4/6 bg-gray-800 rounded-3xl flex flex-col z-40" style={{top: "15%", left: "15%"}}>
        <div className="post-image w-full h-10 bg-cover bg-center top-0 left-0 z-30 rounded-t-3xl" style={{
          backgroundImage: `url(${imageURL})`
        }}></div>
        <div className="post-info flex items-end">
          <div className="post-name mt-4 ml-4 text-2xl text-wrap">{jobPosting.name}</div>
          <div className="post-tags mx-2 flex align-center justify-left flex-wrap">
            <div className="post-tag rounded-3xl px-2 bg-lightgrey text-base text-faded">{jobPosting.category}</div>
          </div>
        </div>
        <div className="info-container flex justify-between">
          <div className="company-info mt-2 mx-4 text-base font-inter flex items-center">
            {jobPosting.company} • ☆ {jobPosting.companyRating?.toFixed(1)} 
            <span className="rating-number opacity-50 ml-1" data-tooltip-id="ratings-tooltip" data-tooltip-content="Reviews">{` (${jobPosting.companyNumberofRatings})`}</span>
            <Tooltip id="ratings-tooltip" />
            <a
              href={`mailto:${jobPosting.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="email-link ml-2"
            ><MdIcons.MdEmail /></a>
            <a
              href={jobPosting.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="discord-link ml-2"
            ><FaIcons.FaDiscord /></a>
            <a
              href={jobPosting.twitter}
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
              <h1 className="post-description-name font-inter text-lg font-bold">Job Description</h1>
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
              <h1 className="post-description-name font-inter text-lg font-bold mb-2">Application Form</h1>
              <form className="form-container flex flex-col h-5/6 justify-between" onSubmit={handleSubmitClick}>
                <div className="inputs flex flex-col text-white h-full text-wrap break-words">
                  <div className='name-email-wallet-container flex items-center mb-2 text-base'>
                    {userData.docs[0].data().name} • 
                    <FaIcons.FaWallet className='ml-2 mr-1' data-tooltip-id="wallet" data-tooltip-content={wallet?.address.slice(0, 40) + (wallet?.address.length > 40 ? '...' : '')} />
                    <Tooltip id="wallet" />
                    <MdIcons.MdEmail className='mx-1' data-tooltip-id="email" data-tooltip-content={userData.docs[0].data().email} /> 
                    <Tooltip id="email" />
                    <FaIcons.FaDiscord className='mx-1' data-tooltip-id="discord" data-tooltip-content={userData.docs[0].data().discord} />
                    <Tooltip id="discord" />
                    <FaIcons.FaTwitter className='mx-1' data-tooltip-id="twitter" data-tooltip-content={userData.docs[0].data().twitter} />
                    <Tooltip id="twitter" />
                    <TbIcons.TbWorldWww className='mx-1' data-tooltip-id="portfolio" data-tooltip-content={userData.docs[0].data().portfolio} />
                    <Tooltip id="portfolio" />
                  </div>
                  <div>About Me: {userData.docs[0].data().about}</div>
                  <textarea
                    name="qualification"
                    value={formChanges.qualification}
                    onChange={handleInputChange}
                    placeholder="Input proof of ability and/or proof of work"
                    className="form-textarea mt-4 p-1 h-full bg-black text-white"
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
        {isSubmitted && (
          <div 
            className={`apply-response fixed z-20 top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-80 bg-black text-white`} 
            style={{opacity: reportMessageOpacity, transition: 'opacity 6s ease-in-out'}}
            onClick={() => {setIsSubmitted(false)}}
          >
            Thank you for applying! Someone will be in touch if your application is accepted.
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDescription
