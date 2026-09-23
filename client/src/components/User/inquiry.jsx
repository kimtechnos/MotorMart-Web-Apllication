import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-simple-toasts";
import "./user.css";

import { apiBase } from "../../utils/config";

const Inquiry = () => {
  const location = useLocation();
  const { carId, carMake, carModel } = location.state || {};
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBase}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carId, message }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        toast("Inquiry submitted successfully!", { theme: "success" });
      } else {
        toast("Failed to submit inquiry:", { theme: "failure" });
      }
    } catch (error) {
      console.error("Error submitting inquiry", error);
      toast("Error occurred while submitting the inquiry", {
        theme: "failure",
      });
    }
  };

  return (
    <div className="inquiry-form-container">
      <h1>Interested in</h1>
      {carId ? (
        <p>
          {carMake} {carModel}
        </p>
      ) : (
        <p>
          Choose a vehicle from the inventory before sending an inquiry.{" "}
          <Link to="/home">Browse vehicles</Link>
        </p>
      )}
      <form className="inquiry-form" onSubmit={handleSubmit}>
        <label>
          Message:
          <textarea
            name="message"
            value={message}
            onChange={handleChange}
            placeholder="Write your inquiry message here..."
            required
          />
        </label>
        <br />
        <button type="submit" disabled={!carId}>
          Submit Inquiry
        </button>
      </form>
    </div>
  );
};

export default Inquiry;
