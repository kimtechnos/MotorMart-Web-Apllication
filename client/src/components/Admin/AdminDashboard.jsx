import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaCar, FaQuestionCircle } from "react-icons/fa";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import "./admin.css";
import { apiBase } from "../../utils/config";

const AdminDashboard = () => {
  const [users, setUsers] = useState(0);
  const [cars, setCars] = useState(0);
  const [inquiries, setInquiries] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, carsResponse, inquiriesResponse] =
          await Promise.all([
            axios.get(`${apiBase}/api/users`, { withCredentials: true }),
            axios.get(`${apiBase}/api/cars`, { withCredentials: true }),
            axios.get(`${apiBase}/api/inquiries`, { withCredentials: true }),
          ]);

        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data.length : 0);
        setCars(Array.isArray(carsResponse.data) ? carsResponse.data.length : 0);
        setInquiries(
          Array.isArray(inquiriesResponse.data?.data)
            ? inquiriesResponse.data.data.length
            : 0,
        );
        setStatus("ready");
      } catch {
        setStatus("error");
        toast("Unable to load dashboard", { theme: "failure" });
      }
    };

    fetchData();
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Admin DASHBOARD</h3>
      </div>
      {status === "loading" ? <p>Loading dashboard...</p> : null}
      {status === "error" ? <p>Unable to load dashboard.</p> : null}
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>USERS</h3>
            <FaUsers className="card_icon" />
          </div>
          <h1>{users}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>CARS</h3>
            <FaCar className="card_icon" />
          </div>
          <h1>{cars}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>INQUIRIES</h3>
            <FaQuestionCircle className="card_icon" />
          </div>
          <h1>{inquiries}</h1>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
