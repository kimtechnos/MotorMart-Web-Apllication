import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiBase } from "../../utils/config";
import {
  BsFillArchiveFill,
  BsFillCarFrontFill,
  BsFillPersonFill,
  BsListCheck,
  BsBoxArrowRight,
} from "react-icons/bs";
import useUserStore from "../../store/useUserstore";
import "./admin.css";

const AdminNavBar = () => {
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
    <aside id="admin-sidebar" className="sidebar">
      {user && (
        <div className="user-welcome">
          {"Welcome"}, {user.fullName}!
        </div>
      )}
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsFillArchiveFill className="icon_header" /> Admin Panel
        </div>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/admin/dashboard">
            <BsFillArchiveFill className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/add-cars">
            <BsFillCarFrontFill className="icon" /> Add cars
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/manage-users">
            <BsFillPersonFill className="icon" /> Manage Users
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/admin/manage-cars">
            <BsFillCarFrontFill className="icon" /> Manage cars
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/admin/manage-inquiries">
            <BsListCheck className="icon" /> Manage Inquiries
          </Link>
        </li>
        <li className="user-sidebar-list-item">
          <button onClick={handleLogout} className="user-logout-button">
            <BsBoxArrowRight className="user-icon" /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AdminNavBar;
