import { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="Navbar">
      <Link to="/home" className="nav-logo" onClick={handleLinkClick}>
        MotorMart
      </Link>
      <button
        type="button"
        className={`nav-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="bar"></div>
      </button>
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
