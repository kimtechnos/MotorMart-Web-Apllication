import { Link } from "react-router-dom";
import "./about.css";

const About = () => {
  return (
    <main className="about-page wrap">
      <p className="badge">About</p>
      <h1>A catalog with a conversation attached to each car.</h1>
      <p className="lede">
        MotorMart is a vehicle marketplace for browsing cars and asking about
        one specific listing. It is not a general message board.
      </p>
      <div className="about-grid">
        <section className="panel">
          <h2>Search</h2>
          <p>
            Filter the public inventory by make, model, year, or a maximum
            price, then open a vehicle for its photo, year, price, and
            description.
          </p>
        </section>
        <section className="panel">
          <h2>Inquire</h2>
          <p>
            Sending an inquiry requires an account. The message stays attached
            to that vehicle and appears on the customer dashboard.
          </p>
        </section>
        <section className="panel">
          <h2>Manage</h2>
          <p>
            Admins maintain inventory, update a listing, and read incoming
            inquiries and contact messages. Public registration cannot create
            an admin.
          </p>
        </section>
      </div>
      <p>
        <Link className="btn" to="/home">
          Browse the inventory
        </Link>
      </p>
    </main>
  );
};

export default About;
