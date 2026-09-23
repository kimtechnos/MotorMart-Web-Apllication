import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-brand">MotorMart</p>
          <p className="muted" style={{ color: "#d9d0c4", marginTop: "0.8rem" }}>
            A vehicle marketplace for browsing listings and asking about one
            specific car.
          </p>
        </div>
        <div>
          <p className="badge">Explore</p>
          <ul>
            <li>
              <Link to="/home">Browse cars</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="badge">Account</p>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/">Register</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-copy">© {new Date().getFullYear()} MotorMart</div>
    </footer>
  );
};

export default Footer;
