import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiBase } from "../../utils/config";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/api/auth/session`, { credentials: "include" })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!cancelled) {
          setSession(body?.data || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSession(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const logout = async () => {
    try {
      await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* the local session still ends */
    }
    setSession(null);
    close();
    navigate("/login");
  };

  const accountHref =
    session?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <header className="Navbar">
      <div className="nav-inner">
        <Link to="/home" className="nav-logo" onClick={close}>
          <span className="nav-mark" aria-hidden="true">
            M
          </span>
          MotorMart
        </Link>
        <button
          type="button"
          className={`nav-toggle ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
        <nav className={`nav-items ${isOpen ? "open" : ""}`} aria-label="Primary">
          <Link to="/home" onClick={close}>
            Browse
          </Link>
          <Link to="/about" onClick={close}>
            About
          </Link>
          <Link to="/contact" onClick={close}>
            Contact
          </Link>
          {session ? (
            <>
              <Link to={accountHref} className="nav-account" onClick={close}>
                Account
              </Link>
              <button type="button" className="nav-logout" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login" onClick={close}>
                Login
              </Link>
              <Link to="/" className="nav-signup" onClick={close}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
