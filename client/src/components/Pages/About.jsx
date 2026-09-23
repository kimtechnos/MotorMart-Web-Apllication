import { Link } from "react-router-dom";
import "./about.css";

const About = () => {
  return (
    <main className="about-page">
      <h1>About MotorMart</h1>
      <p>
        MotorMart is a vehicle marketplace for browsing cars and asking the
        seller a question about one specific listing.
      </p>
      <p>
        Search by make, model, year, or maximum price, then open a vehicle to
        see its photo, year, price, and description. Sending an inquiry
        requires an account, and the message stays attached to that vehicle.
      </p>
      <p>
        Customers can review their own inquiries from the dashboard. Admins
        maintain the inventory, update a listing, and read incoming inquiries
        and contact messages.
      </p>
      <p>
        <Link to="/home">Browse the inventory</Link>
      </p>
    </main>
  );
};

export default About;
