import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethos } from 'ethos-connect'
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc
} from "@firebase/firestore";
import BlurBg from '../assets/dark-blurred-bg.jpeg';
import DefaultPfp from '../assets/default-pfp.png';
import Profile from "./Profile";

const Navbar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [q, setQ] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pubKey: '',
    about: '',
    email: '',
    portfolio: '',
    discord: '',
    twitter: '',
  });
  const [formChanges, setFormChanges] = useState({});
  
  const { wallet } = ethos.useWallet();
  const docRef = collection(db, "users");
    
  const fetchData = async () => {
    if (wallet?.address) {
      const q = query(
        docRef,
        where("pubKey", "==", wallet.address)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      setQ(querySnapshot);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data(); // Assuming one document per user
        setFormData({
          name: docData.name || "",
          pubKey: docData.pubKey || "",
          about: docData.about || "",
          email: docData.email || "",
          portfolio: docData.portfolio || "",
          discord: docData.discord || "",
          twitter: docData.twitter || "",
        });
      } else {
        addDoc(collection(db, "users"), {
          pubKey: wallet.address,
          name: "Example",
          about: "Example About Me",
          email: "example@gmail.com",
          portfolio: "example.com",
          discord: "example",
          twitter: "@example",
        })
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        setQ(querySnapshot);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data(); // Assuming one document per user
          setFormData({
            name: docData.name || "",
            pubKey: docData.pubKey || "",
            about: docData.abou || "",
            email: docData.email || "",
            portfolio: docData.portfolio || "",
            discord: docData.discord || "",
            twitter: docData.twitter || "",
          });
        }
      };
    } else {
      console.log("Wallet address is undefined.");
    }
  };
  
  const handlePostClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormChanges(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault(); // This will prevent the page refresh
    saveData(); // Assuming saveData is your function to handle the form submission logic
  };
  
  const saveData = async () => {
    if (q && !q.empty) { // Ensure `q` is checked for null/undefined
      const docRef = q.docs[0].ref;
      const updates = {};
  
      // Iterate through `formChanges` to see which fields were updated
      Object.keys(formChanges).forEach((key) => {
        if (formChanges[key]) { // If the field has been changed
          updates[key] = formChanges[key]; // Get the updated value from `formChanges`
        }
      });
  
      try {
        if (Object.keys(updates).length > 0) {
          await updateDoc(docRef, updates);
          console.log("Updated sections saved successfully.");
  
          // Reset formChanges after successful update
          setFormChanges({});
          fetchData();
        } else {
          console.log("No changes to save.");
        }
      } catch (error) {
        console.error("Error saving responses:", error);
      }
    } else {
      console.log("No document found for the current user.");
    }
  };
  
  return (
    <div className="navbar flex justify-between items-center h-20 font-anton bg-transparent text-white z-10">
      <Link to="/">
        <div className="navbar-left flex items-center ml-4 text-3xl">
          <span className="text-white">SUI</span>
          <span className="text-ssblue">SNAILS</span>
          <span className="text-white ml-2">LANCER</span>
        </div>
      </Link>
      <div className="navbar-right mr-4 font-inter flex">
        <ethos.components.AddressWidget 
          excludeButtons={[
            ethos.enums.AddressWidgetButtons.CopyWalletAddress,
            ethos.enums.AddressWidgetButtons.WalletExplorer
          ]}
          extraButtons={[<Profile key="create-profile" onClick={fetchData} setIsPopupOpen={setIsPopupOpen} />]}
        />
      </div>
      {isPopupOpen && (
        <div className="popup fixed top-0 left-0 z-10 w-full h-full">
          <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={handlePostClick}></div>
          {/* Popup content */}
          <div className="popup-container absolute w-4/6 h-4/6 bg-gray-800 rounded-3xl flex z-40" style={{top: "10%", left: "15%"}}>
            <div className="profile-container flex flex-col items-center justify-between my-4 mx-4 w-2/5 font-inter rounded-3xl bg-cover bg-center z-50" style={{backgroundImage: `url(${BlurBg})`}}>
              <div className="pfp m-6 flex flex-col items-center">
                <img src={DefaultPfp} alt='default' className="mb-4 w-2/3"></img>
                <h1 className="font-bold text-lg mb-1">{formData.name}</h1>
                <h1 className="text-base opacity-80">{formData.about}</h1>
              </div>
              <div className="profile-info flex flex-col w-full items-center text-sm mb-8">
                <hr className="line opacity-20 w-11/12 my-4 mx-4" />
                <div className="flex w-full justify-between px-3 flex-wrap">
                  <p className="font-bold">Email</p>
                  <p className="text-gray-200 opacity-70 break-words">{formData.email}</p>
                </div>
                <div className="flex w-full justify-between px-3 flex-wrap">
                  <p className="font-bold">Portfolio</p>
                  <p className="text-gray-200 opacity-70 break-words">{formData.portfolio}</p>
                </div>
                <div className="flex w-full justify-between px-3 flex-wrap">
                  <p className="font-bold">Discord</p>
                  <p className="text-gray-200 opacity-70 break-words">{formData.discord}</p>
                </div>
                <div className="flex w-full justify-between px-3 flex-wrap">
                  <p className="font-bold">Twitter</p>
                  <p className="text-gray-200 opacity-70 break-words">{formData.twitter}</p>
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
                  className="form-input mb-3 p-1 bg-black w-full"
                />
                <p className="form-field mb-1">About</p>
                <input
                  type="text"
                  name="about"
                  value={formChanges.about}
                  onChange={handleInputChange}
                  placeholder="i.e. Certified degen w/ 3+ yrs experience in web3"
                  className="form-input mb-3 p-1 bg-black w-full text-wrap"
                ></input>
                <p className="form-field mb-1">Email</p>
                <input
                  type="email"
                  name="email"
                  value={formChanges.email}
                  onChange={handleInputChange}
                  placeholder="i.e. suisnailsnft@gmail.com"
                  className="form-input mb-3 p-1 bg-black w-full"
                />
                <p className="form-field mb-1">Link to Portfolio</p>
                <input
                  type="text"
                  name="portfolioLink"
                  value={formChanges.portfolioLink}
                  onChange={handleInputChange}
                  placeholder="i.e. www.suisnails.io"
                  className="form-input mb-3 p-1 bg-black w-full"
                />
                <p className="form-field mb-1">Discord Handle</p>
                <input
                  type="text"
                  name="discordUsername"
                  value={formChanges.discord}
                  onChange={handleInputChange}
                  placeholder="i.e. melondotdev"
                  className="form-input mb-3 p-1 bg-black w-full"
                />
                <p className="form-field mb-1">Twitter Handle</p>
                <input
                  type="text"
                  name="twitterProfile"
                  value={formChanges.twitter}
                  onChange={handleInputChange}
                  placeholder="i.e. @melondotdev"
                  className="form-input mb-3 p-1 bg-black w-full"
                />
                <button type='submit' className="submit-button bg-slate-600 bg-cover rounded-3xl px-4 py-1 w-full">Update Profile</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
