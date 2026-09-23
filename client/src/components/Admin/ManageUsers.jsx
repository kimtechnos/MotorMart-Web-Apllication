import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import Usercard from "./Usercard";

import { apiBase } from "../../utils/config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get(`${apiBase}/api/users`, {
          withCredentials: true,
        });
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setStatus("ready");
      } catch {
        setStatus("error");
        toast("Unable to load users", { theme: "failure" });
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/api/users/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user.id !== id));
      toast("User deleted successfully", { theme: "success" });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to delete user";
      toast(message, { theme: "failure" });
    }
  };

  return (
    <div className="section-users">
      <h1>Manage User Accounts</h1>
      {status === "loading" ? <p>Loading users...</p> : null}
      {status === "error" ? <p>Unable to load users.</p> : null}
      {status === "ready" && users.length === 0 ? <p>No user accounts yet.</p> : null}
      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Usercard
              key={user.id}
              id={user.id}
              fullName={user.fullName}
              email={user.email}
              phoneNumber={user.phoneNumber}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
