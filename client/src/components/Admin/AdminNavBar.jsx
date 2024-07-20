import React from "react";
import { Link } from "react-router-dom";
import {
  BsFillArchiveFill,
  BsFillCarFrontFill,
  BsFillPersonFill,
  BsListCheck,
} from "react-icons/bs";
import "./admin.css";

const AdminNavBar = () => {
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
          <Link to="/admin/manage-users">
            <BsFillPersonFill className="icon" /> Manage Users
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/manage-cars">
            <BsFillCarFrontFill className="icon" /> Manage Cars
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/manage-inquiries">
            <BsListCheck className="icon" /> Manage Inquiries
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminNavBar;
