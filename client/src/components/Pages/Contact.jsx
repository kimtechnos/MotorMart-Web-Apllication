import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.scss";
import { apiBase } from "../../utils/config";

function Contact() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [notice, setNotice] = useState("");

  const { name, email, subject, message } = state;

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");

    if (!name || !email || !message) {
      toast.error("Please provide value in each input field");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please provide a valid email address");
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Unable to send message");
        return;
      }
      toast.success("Message sent successfully");
      setNotice("Message sent successfully");
      setState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Unable to send message");
    }
  };

  const handleInputChange = (event) => {
    const { name: field, value } = event.target;
    setState({ ...state, [field]: value });
  };

  return (
    <section className="contact-page wrap">
      <ToastContainer position="top-center" />
      <div className="contact-copy">
        <p className="badge">Contact</p>
        <h1>Send a message about MotorMart.</h1>
        <p className="lede">
          Use this form for questions about the marketplace. To ask about a
          specific car, open that listing and send an inquiry.
        </p>
        <p>
          <span>Email</span>
          <a href="mailto:motor@mart.com">motor@mart.com</a>
        </p>
        <p>
          <span>Location</span>
          Nairobi, Kenya
        </p>
      </div>
      <form id="contactForm" className="contact-form panel" onSubmit={handleSubmit}>
        <h2>Send us a message</h2>
        <label htmlFor="contact-name">
          Name
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Your name"
            onChange={handleInputChange}
            value={name}
            aria-label="Name"
          />
        </label>
        <label htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            onChange={handleInputChange}
            value={email}
            aria-label="Email"
          />
        </label>
        <label htmlFor="contact-subject">
          Subject
          <input
            id="contact-subject"
            type="text"
            name="subject"
            placeholder="Optional subject"
            onChange={handleInputChange}
            value={subject}
            aria-label="Subject"
          />
        </label>
        <label htmlFor="contact-message">
          Message
          <textarea
            id="contact-message"
            name="message"
            placeholder="How can we help?"
            onChange={handleInputChange}
            value={message}
            aria-label="Message"
          />
        </label>
        <input type="submit" value="Send Message" className="btn" aria-label="Send Message" />
        {notice ? <p role="status">{notice}</p> : null}
      </form>
    </section>
  );
}

export default Contact;
