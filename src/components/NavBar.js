import React from "react";
import shookLogo from "../assets/shookLogo.png";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <img src={shookLogo} alt="Logo" className="navbar-logo"  />
      </div>
    </nav>
  );
}