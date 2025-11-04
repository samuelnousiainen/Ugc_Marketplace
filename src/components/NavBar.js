import React from "react";
import { Link } from "react-router-dom";
import shookLogo from "../assets/shookLogo.png";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/">
          <img src={shookLogo} alt="Logo" className="navbar-logo" />
        </Link>
        
        <div style={{ marginLeft: "auto" }}>
          <Link to="/you">
            <div 
              className="profile-avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--bg-dark)",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
            >
              U
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}