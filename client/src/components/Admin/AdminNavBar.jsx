import React from "react";
import { Link,Navigate, useNavigate } from "react-router-dom";
import { apiBase } from "../../utils/config";
import {
  BsFillArchiveFill,
  BsFillCarFrontFill,
  BsFillPersonFill,
  BsListCheck,
  BsBoxArrowRight,
} from "react-icons/bs";
import "./admin.css";

const AdminNavBar = () => {
  const navigate = useNavigate();
    const storedData = JSON.parse(localStorage.getItem("motarmart-user"));
    const user = storedData?.state?.user;
    console.log("Retrieved user from local storage:", user);
  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
       
        localStorage.removeItem("authToken");

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
