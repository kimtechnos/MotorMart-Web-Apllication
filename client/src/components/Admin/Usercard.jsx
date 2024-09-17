import React from "react";
import "./admin.css";

const Usercard = ({ id, fullName, email, phoneNumber, onDelete }) => {
  return (
    <tr>
      <td>{fullName}</td>
      <td>{email}</td>
      <td>{phoneNumber}</td>
      <td>
        <button className="delete-btn" onClick={() => onDelete(id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Usercard;
