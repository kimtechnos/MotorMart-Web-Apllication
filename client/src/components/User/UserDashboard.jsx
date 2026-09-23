import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/useUserstore";
import { apiBase } from "../../utils/config";
import "./user.css";

const UserDashboard = () => {
  const user = useUserStore((state) => state.user);
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetch(`${apiBase}/api/inquiries/mine`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load inquiries");
        }
        return response.json();
      })
      .then((body) => {
        if (cancelled) {
          return;
        }
        setInquiries(Array.isArray(body.data) ? body.data : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="user-dashboard">
      <h1>Welcome{user?.fullName ? `, ${user.fullName}` : ""}</h1>
      <section>
        <h2>Your account</h2>
        <p>{user?.email}</p>
        <p>{user?.phoneNumber}</p>
        <p>
          <Link to="/user/profile">Edit profile</Link>
        </p>
      </section>
      <section>
        <h2>Your inquiries</h2>
        {status === "loading" ? <p>Loading inquiries...</p> : null}
        {status === "error" ? <p>Unable to load inquiries.</p> : null}
        {status === "ready" && inquiries.length === 0 ? (
          <p>You have not sent any inquiries yet.</p>
        ) : null}
        {status === "ready"
          ? inquiries.map((inquiry) => (
              <article key={inquiry.id}>
                <h3>
                  {inquiry.car?.make} {inquiry.car?.model}
                </h3>
                <p>{inquiry.message}</p>
                {inquiry.car?.id ? (
                  <Link to={`/cars/${inquiry.car.id}`}>View vehicle</Link>
                ) : null}
              </article>
            ))
          : null}
      </section>
      <p>
        <Link to="/home">Browse vehicles</Link>
      </p>
    </div>
  );
};

export default UserDashboard;
