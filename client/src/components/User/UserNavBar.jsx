import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFillGridFill,
  BsFillCarFrontFill,
  BsFillPersonFill,
  BsChatDotsFill,
  BsBoxArrowRight,
} from "react-icons/bs";
import { apiBase } from "../../utils/config";
import useUserStore from "../../store/useUserstore";
import "./user.css";

const UserNavBar = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUserInformation = useUserStore(
    (state) => state.clearUserInformation,
  );

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        clearUserInformation();
        navigate("/");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("An error occurred during logout:", err);
    }
  };

  return (
    <aside id="user-sidebar" className="user-sidebar">
      {user && (
        <div className="user-welcome">
          {"Welcome"}, {user.fullName}!
        </div>
      )}
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

        <Link to="/user/post-inquiry"></Link>

        <li className="user-sidebar-list-item">
          <button onClick={handleLogout} className="user-logout-button">
            <BsBoxArrowRight className="user-icon" /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default UserNavBar;
