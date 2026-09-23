import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/useUserstore";
import { apiBase } from "./config";

const ProtectedRoutes = ({ allowedRoles }) => {
  const user = useUserStore((state) => state.user);
  const changeUserInformation = useUserStore(
    (state) => state.changeUserInformation,
  );
  const clearUserInformation = useUserStore(
    (state) => state.clearUserInformation,
  );
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetch(`${apiBase}/api/auth/session`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((body) => {
        if (cancelled) {
          return;
        }
        changeUserInformation(body.data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        clearUserInformation();
        setStatus("anonymous");
      });

    return () => {
      cancelled = true;
    };
  }, [changeUserInformation, clearUserInformation]);

  if (status === "loading") {
    return null;
  }

  if (status === "anonymous" || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

ProtectedRoutes.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoutes;
