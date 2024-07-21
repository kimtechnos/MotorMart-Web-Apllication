import React from "react";
import { Link } from "react-router-dom";
import {
  BsFillGridFill,
  BsFillCarFrontFill,
  BsFillPersonFill,
  BsChatDotsFill,
  BsBoxArrowRight,
} from "react-icons/bs";
import "./user.css";

const UserNavBar = () => {
  return (
    <aside id="user-sidebar" className="user-sidebar">
      <div className="user-sidebar-title">
        <div className="user-sidebar-brand">
          <BsFillGridFill className="user-icon-header" /> User Panel
        </div>
      </div>
      <ul className="user-sidebar-list">
        <li className="user-sidebar-list-item">
          <Link to="/user/dashboard">
            <BsFillGridFill className="user-icon" /> Dashboard
          </Link>
        </li>
        <li className="user-sidebar-list-item">
          <Link to="/user/view-cars">
            <BsFillCarFrontFill className="user-icon" /> View Cars
          </Link>
        </li>
        <li className="user-sidebar-list-item">
          <Link to="/user/profile">
            <BsFillPersonFill className="user-icon" /> Profile
          </Link>
        </li>
        <li className="user-sidebar-list-item">
          <Link to="/user/post-inquiry">
            <BsChatDotsFill className="user-icon" /> Post Inquiry
          </Link>
        </li>
        <li className="user-sidebar-list-item">
          <Link to="/user/logout">
            <BsBoxArrowRight className="user-icon" /> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default UserNavBar;
