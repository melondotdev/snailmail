import React, { useState } from 'react';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formChanges, setFormChanges] = useState({});

  const handleLoginClick = () => {
    setIsLoggingIn(!isLoggingIn);
    setIsSubmit(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormChanges(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    sendEmailLink(formChanges.email); // Pass email to sendEmailLink
  }
  
  const sendEmailLink = (email) => { // Modify function to accept email as parameter
    const actionCodeSettings = {
      url: 'https://lancer.suisnails.io',
      handleCodeInApp: true,
    };
    
    const auth = getAuth();

    sendSignInLinkToEmail(auth, email, actionCodeSettings) // Use provided email parameter
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <div className='login font-inter text-white'>
      <button className="login-button font-anton text-xl items-center justify-center w-full bg-transparent px-6 py-1 rounded-3xl border-2 border-ssblue hover:bg-ssblue hover:text-darkblue ease-in-out duration-300" onClick={handleLoginClick}>Login</button>
      {isLoggingIn && (
        <div className="login-container fixed top-0 left-0 z-10 w-full h-full">
          <div className="login-lightbox fixed w-full h-full bg-lightbox bg-cover z-10" onClick={handleLoginClick}></div>
          <div className="login-details-container absolute w-3/6 min-w-96 h-3/6 min-h-96 bg-gray-800 rounded-3xl flex flex-col z-40 justify-evenly" style={{top: "25%", left: "25%"}}>
            <div className='login-inner-container p-12'>
              <div className='login-header mb-4'>
                <h1 className='login-title w-full text-center text-3xl font-bold mb-2'>Login</h1>
                <p className='login-instructions text-red text-center opacity-50 mx-4'>
                  {isSubmit ? "Email has been sent! Please check your inbox." : "(Tip: if you do not have an account yet, sending an email link will create one for you!)" }</p>
              </div>
              <div className='form-container-shell mx-4'>
                <form className="form-container flex flex-col font-inter text-xl items-start w-full" onSubmit={handleSubmit}>
                  <p className="form-field mb-1">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={formChanges.email || ''} // Use formChanges.email for input value
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="form-input p-1 bg-black w-full text-base"
                  />
                  <button type='submit' className="submit-button bg-slate-600 bg-cover rounded-xl mt-6 py-1 w-full text-base">Send email link</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login;
