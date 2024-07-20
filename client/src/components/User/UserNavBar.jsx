import React from "react";
import { Link } from "react-router-dom";

const UserNavBar = () => (
  <nav className="user-navbar">
    <ul>
      <li>
        <Link to="dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="view-cars">View Cars</Link>
      </li>

      <li>
        <Link to="profile">Profile</Link>
      </li>
      <li>
        <Link to="post-inquiry">PostInquiry</Link>
      </li>
      <li>
        <Link to="logout">Logout</Link>
      </li>
    </ul>
  </nav>
);

export default UserNavBar;
