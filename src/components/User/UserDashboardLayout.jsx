import React from "react";
import { Outlet } from "react-router-dom";
import UserNavBar from "./UserNavBar";

const UserDashboardLayout = () => (
  <div className="user-dashboard-layout">
    <UserNavBar />
    <div className="user-main">
      <Outlet />
    </div>
  </div>
);

export default UserDashboardLayout;
