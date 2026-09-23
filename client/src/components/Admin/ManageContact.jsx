import { useEffect, useState } from "react";
import { apiBase } from "../../utils/config";
import "./admin.css";

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetch(`${apiBase}/api/contact`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load messages");
        }
        return response.json();
      })
      .then((body) => {
        if (cancelled) {
          return;
        }
        setMessages(Array.isArray(body.data) ? body.data : []);
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
    <div className="section-inquiries">
      <h1 className="inquiries-title">Contact messages</h1>
      {status === "loading" ? <p>Loading messages...</p> : null}
      {status === "error" ? <p>Unable to load messages.</p> : null}
      {status === "ready" && messages.length === 0 ? (
        <p>No contact messages yet.</p>
      ) : null}
      {status === "ready"
        ? messages.map((item) => (
            <article key={item.id} className="inquiry">
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Email:</strong> {item.email}
              </p>
              {item.subject ? (
                <p>
                  <strong>Subject:</strong> {item.subject}
                </p>
              ) : null}
              <p>
                <strong>Message:</strong> {item.message}
              </p>
            </article>
          ))
        : null}
    </div>
  );
};

export default ManageContact;
