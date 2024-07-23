import React, { useState, useEffect } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaPhone } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import toast from "react-simple-toasts";
import "./user.css"

import { apiBase } from "../../utils/config";

const Inquiry = () => {
  const location = useLocation();
  const { carMake, carModel } = location.state || {};
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Received car data:", { carMake, carModel });
  }, [carMake, carModel]);

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
        body: JSON.stringify({ make: carMake, model: carModel, message }),
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
      <h1>Intrested with:</h1>
      <h2>CarMake: {carMake}</h2>
      <h3>CarModel:{carModel}</h3>
      <form className="inquiry-form" onSubmit={handleSubmit}>
        <label>
          Message:
          <textarea
            name="message"
            value={message}
            onChange={handleChange}
            placeholder="Write your inquiry message here..."
          />
        </label>
        <br />
        <button type="submit">Submit Inquiry</button>
      </form>
      <div className="social-media-icons">
        <a
          href="https://www.facebook.com/francis.kimani.96343405"
          target="_blank"
        >
          <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank">
          <FaTwitter />
        </a>
        <a href="https://instagram.com" target="_blank">
          <FaInstagram />
        </a>
        <a href="tel:+254769334187">
          <FaPhone />
        </a>
      </div>
    </div>
  );
};

export default Inquiry;
