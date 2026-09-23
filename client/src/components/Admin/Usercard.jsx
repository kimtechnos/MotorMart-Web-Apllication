import PropTypes from "prop-types";
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

Usercard.propTypes = {
  id: PropTypes.string,
  fullName: PropTypes.string,
  email: PropTypes.string,
  phoneNumber: PropTypes.string,
  onDelete: PropTypes.func,
};

export default Usercard;
