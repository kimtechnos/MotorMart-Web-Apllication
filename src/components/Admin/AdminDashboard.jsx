import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, carsResponse, inquiriesResponse] =
          await Promise.all([
            axios.get(`${apiBase}/api/users`, { withCredentials: true }),
            axios.get(`${apiBase}/api/cars`, { withCredentials: true }),
            axios.get(`${apiBase}/api/inquiries`, { withCredentials: true }),
          ]);

        console.log("Users Response:", usersResponse.data);
        console.log("Cars Response:", carsResponse.data);
        console.log("Inquiries Response:", inquiriesResponse.data);

        setUsers(usersResponse.data.length);

        setCars(carsResponse.data.length);
        if (
          inquiriesResponse.data &&
          Array.isArray(inquiriesResponse.data.data)
        ) {
          setInquiries(inquiriesResponse.data.data.length);
        }

        toast("Data fetched successfully", { theme: "success" });
      } catch (error) {
        console.error("Error fetching data", error);
        toast("Failed to fetch data", { theme: "failure" });
      }
    };

    fetchData();
  }, []);

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
