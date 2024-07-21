import React from "react";
import "./admin.css"
import { FaUsers, FaCar, FaQuestionCircle } from "react-icons/fa";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";

import { apiBase } from "../../utils/config";

const AdminDashboard = () => {
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Admin DASHBOARD</h3>
      </div>
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>USERS</h3>
            <FaUsers className="card_icon" />
          </div>
          <h1>30</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>CARS</h3>
            <FaCar className="card_icon" />
          </div>
          <h1>40</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>INQUIRIES</h3>
            <FaQuestionCircle className="card_icon" />
          </div>
          <h1>10</h1>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
