import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import "./admin.css";
import { apiBase } from "../../utils/config";

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`${apiBase}/api/inquiries`, {
          withCredentials: true,
        });
        setInquiries(response.data.data);
      } catch (error) {
        console.log("erroer fetching the data ", error);
        toast("failed to fetch data", { theme: "failure" });
      }
    };
    fetchInquiries();
  }, []);
  return (
    <div className="section-inquiries">
      <h1 className="inquiries-title">User and Car Inquiries</h1>
      <div className="inquiries">
        <div className="inquiries-list">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="inquiry">
              <div className="user-info">
                <p>
                  <strong>User:</strong> {inquiry.user.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {inquiry.user.email}
                </p>
              </div>
              <div className="car-info">
                <p>
                  <strong>Car Make:</strong> {inquiry.car.make}
                </p>
                <p>
                  <strong>Car Model:</strong> {inquiry.car.model}
                </p>
              </div>
              <div className="car-info">
                <p>
                  <strong>Message:</strong> {inquiry.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageInquiries;
