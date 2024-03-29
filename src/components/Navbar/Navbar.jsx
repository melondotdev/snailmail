import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">
        <div className="navbar-left">
          <span style={{ color: "white" }}>SUI</span>
          <span style={{ color: "#0AAEFF" }}>SNAILS</span>
          <span style={{ color: "white", marginLeft: "0.5rem" }}>LANCER</span>
        </div>
      </Link>
      <div className="navbar-right">
        <button className="login-button">Login</button>
      </div>
    </div>
  );
};

export default Navbar;
