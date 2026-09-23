import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import "./admin.css";
import { apiBase } from "../../utils/config";

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`${apiBase}/api/inquiries`, {
          withCredentials: true,
        });
        setInquiries(Array.isArray(response.data.data) ? response.data.data : []);
        setStatus("ready");
      } catch {
        setStatus("error");
        toast("Unable to load inquiries", { theme: "failure" });
      }
    };
    fetchInquiries();
  }, []);
  return (
    <div className="section-inquiries">
      <h1 className="inquiries-title">User and Car Inquiries</h1>
      {status === "loading" ? <p>Loading inquiries...</p> : null}
      {status === "error" ? <p>Unable to load inquiries.</p> : null}
      {status === "ready" && inquiries.length === 0 ? (
        <p>No inquiries yet.</p>
      ) : null}
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
