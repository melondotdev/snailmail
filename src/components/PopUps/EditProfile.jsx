import React, { useState } from 'react'
import BlurBg from '../../assets/dark-blurred-bg.jpeg';
import DefaultPfp from '../../assets/default-pfp.png';

const EditProfile = ({ userData, isEditProfile, setIsEditProfile, saveData }) => {
  const [formChanges, setFormChanges] = useState({
    name: '',
    about: '',
    email: '',
    portfolio: '',
    discord: '',
    twitter: ''
  });
  
  const handlePostClick = () => {
    setIsEditProfile(!isEditProfile);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormChanges(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault(); // This will prevent the page refresh
    saveData(formChanges); // Assuming saveData is your function to handle the form submission logic
  };

  return (
    <div className="popup fixed top-0 left-0 z-10 w-full h-full text-white">
      <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={handlePostClick}></div>
      {/* Popup content */}
      <div className="popup-container absolute w-4/6 h-4/6 bg-gray-800 rounded-3xl flex z-40" style={{top: "10%", left: "15%", minWidth: "700px", minHeight: "450px"}}>
        <div className="profile-container flex flex-col items-center justify-between my-4 mx-4 w-2/5 font-inter rounded-3xl bg-cover bg-center z-50" style={{backgroundImage: `url(${BlurBg})`}}>
          <div className="pfp m-6 w-full flex flex-col items-center">
            <img src={DefaultPfp} alt='default' className="mb-4 w-1/3"></img>
            <h1 className="font-bold text-lg mb-1">{userData.docs[0].data().name}</h1>
            <h1 className="text-base opacity-80 text-center w-full break-words px-4 text-sm overflow-y-auto">{userData.docs[0].data().about}</h1>
          </div>
          <div className="profile-info flex flex-col w-full items-center text-sm mb-8">
            <hr className="line opacity-20 w-11/12 my-4 mx-4" />
            <div className="flex w-full justify-between px-3 flex-wrap">
              <p className="font-bold">Email</p>
              <p className="text-gray-200 opacity-70 break-words">{userData.docs[0].data().email}</p>
            </div>
            <div className="flex w-full justify-between px-3 flex-wrap">
              <p className="font-bold">Portfolio</p>
              <p className="text-gray-200 opacity-70 break-words">{userData.docs[0].data().portfolio}</p>
            </div>
            <div className="flex w-full justify-between px-3 flex-wrap">
              <p className="font-bold">Discord</p>
              <p className="text-gray-200 opacity-70 break-words">{userData.docs[0].data().discord}</p>
            </div>
            <div className="flex w-full justify-between px-3 flex-wrap">
              <p className="font-bold">Twitter</p>
              <p className="text-gray-200 opacity-70 break-words">{userData.docs[0].data().twitter}</p>
            </div>
          </div>
        </div>
        <div className="profile-description-container mt-4 mr-4 h-full w-3/5 rounded-3xl z-50">
          <form className="form-container flex flex-col font-inter text-sm items-start w-full" onSubmit={handleSubmit}>
            <p className="form-field mb-1">{`Name (Preferred)`}</p>
            <input
              type="text"
              name="name"
              value={formChanges.name}
              onChange={handleInputChange}
              placeholder="i.e. Melon"
              className="form-input mb-3 p-1 bg-black w-full text-xs"
            />
            <p className="form-field mb-1">About</p>
            <input
              type="text"
              name="about"
              value={formChanges.about}
              onChange={handleInputChange}
              placeholder="i.e. Certified degen w/ 3+ yrs experience in web3"
              className="form-input mb-3 p-1 bg-black w-full text-wrap text-xs"
            ></input>
            <p className="form-field mb-1">Email</p>
            <input
              type="email"
              name="email"
              value={formChanges.email}
              onChange={handleInputChange}
              placeholder="i.e. suisnailsnft@gmail.com"
              className="form-input mb-3 p-1 bg-black w-full text-xs"
            />
            <p className="form-field mb-1">Link to Portfolio</p>
            <input
              type="text"
              name="portfolio"
              value={formChanges.portfolio}
              onChange={handleInputChange}
              placeholder="i.e. www.suisnails.io"
              className="form-input mb-3 p-1 bg-black w-full text-xs"
            />
            <p className="form-field mb-1">Discord Handle</p>
            <input
              type="text"
              name="discord"
              value={formChanges.discord}
              onChange={handleInputChange}
              placeholder="i.e. melondotdev"
              className="form-input mb-3 p-1 bg-black w-full text-xs"
            />
            <p className="form-field mb-1">Twitter Handle</p>
            <input
              type="text"
              name="twitter"
              value={formChanges.twitter}
              onChange={handleInputChange}
              placeholder="i.e. @melondotdev"
              className="form-input mb-3 p-1 bg-black w-full text-xs"
            />
            <button type='submit' className="submit-button bg-slate-600 bg-cover rounded-3xl mt-2 px-4 py-1 w-full">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
