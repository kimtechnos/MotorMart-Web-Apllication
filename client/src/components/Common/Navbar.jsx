import React, { useState } from "react";
import { Link } from "react-router-dom";
import TypingAnimator from "react-typing-animator";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logo = ["Motor", "Mart"];

  return (
    <div className="Navbar">
      <span className="nav-logo">
        <TypingAnimator
          textArray={logo}
          loop
          textColor="yellow"
          fontSize="2rem"
        />
      </span>
      <div
        className={`nav-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
      </div>
      <div className={`nav-items ${isOpen ? "open" : ""}`}>
        <Link to="/home" onClick={handleLinkClick}>
          Home
        </Link>
        <Link to="/about" onClick={handleLinkClick}>
          About
        </Link>
        <Link to="/contact" onClick={handleLinkClick}>
          Contact
        </Link>
        <Link to="/" className="nav-login" onClick={handleLinkClick}>
          Register
        </Link>
        <Link to="/login" className="nav-signup" onClick={handleLinkClick}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
