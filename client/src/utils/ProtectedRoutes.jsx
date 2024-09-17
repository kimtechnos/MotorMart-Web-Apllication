import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoutes = ({ allowedRoles }) => {
  const isLoggedIn = window.localStorage.getItem("authToken"); // Check if the token exists
  const userRole = window.localStorage.getItem("userRole"); // Get the user role

  if (!isLoggedIn) {
    // If not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If user role is not allowed, redirect to unauthorized page
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and role matches, render the component (children)
  return <Outlet />;
};

export default ProtectedRoutes;
