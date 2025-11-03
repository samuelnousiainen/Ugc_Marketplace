import React from "react";
import { Link } from "react-router-dom";
import shookLogo from "../assets/shookLogo.png";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" aria-label="Home">
          <img src={shookLogo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
    </nav>
  );
}