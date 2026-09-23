import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="wrap" style={{ padding: "6.4rem 0" }}>
      <p className="badge">404</p>
      <h1 style={{ fontSize: "4.8rem", margin: "1.2rem 0" }}>This page is not on the lot.</h1>
      <p className="muted">The address does not match a MotorMart page.</p>
      <p style={{ marginTop: "2.4rem" }}>
        <Link className="btn" to="/home">
          Browse cars
        </Link>
      </p>
    </section>
  );
};

export default NotFound;
