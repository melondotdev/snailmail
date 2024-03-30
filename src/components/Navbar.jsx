import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar flex justify-between items-center h-16 font-anton bg-transparent text-white z-10">
      <Link to="/">
        <div className="navbar-left flex items-center ml-4 text-3xl">
          <span className="text-white">SUI</span>
          <span className="text-ssblue">SNAILS</span>
          <span className="text-white ml-2">LANCER</span>
        </div>
      </Link>
      <div className="navbar-right mr-4">
        <button className="login-button px-6 py-1 text-2xl border border-ssblue rounded-full text-white hover:bg-ssblue hover:text-blue-900 transition duration-300">Login</button>
      </div>
    </div>
  );
};

export default Navbar;
