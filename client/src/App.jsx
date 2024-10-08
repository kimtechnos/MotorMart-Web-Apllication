import { useState } from "react";
import "./assets/global.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import Home from "./components/Pages/Home";
import Contact from "./components/Pages/Contact";
import About from "./components/Pages/About";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminNavBar from "./components/Admin/AdminNavBar";
import UserNavBar from "./components/User/UserNavBar";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageUsers from "./components/Admin/ManageUsers";
import ManageCars from "./components/Admin/ManageCars";
import AddCars from "./components/Admin/AddCars";
import ManageInquiries from "./components/Admin/ManageInquiries";
import UserDashboard from "./components/User/UserDashboard";
import ViewCar from "./components/User/ViewCar";
import PostInquiry from "./components/User/inquiry";
import UserProfile from "./components/User/profile";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Unauthorized from "./utils/Unauthorized";

import "./App.css";

const AdminLayout = () => (
  <div className="admin-layout">
    <AdminNavBar />
    <div className="admin-main">
      <Outlet />
    </div>
  </div>
);

const UserLayout = () => (
  <div className="user-layout">
    <UserNavBar />
    <div className="user-main">
      <Outlet />
    </div>
  </div>
);

const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserRoute = location.pathname.startsWith("/user");
  return (
    <>
      {!isAdminRoute && !isUserRoute && <Navbar />}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
        </Route>

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="add-cars" element={<AddCars />} />
            <Route path="manage-inquiries" element={<ManageInquiries />} />
          </Route>
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
          <Route path="user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="view-cars" element={<ViewCar />} />
            <Route path="post-inquiry" element={<PostInquiry />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
