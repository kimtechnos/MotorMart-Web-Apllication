import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./admin.css";

const CarCard = ({
  carImg,
  carTitle,
  carYear,
  carPrice,
  carDescription,
  id,
  onDelete,
}) => {
  return (
    <div className="car-card">
      <div className="car-img">
        <img src={carImg} alt={carTitle} />
      </div>
      <div className="car-info">
        <h2>{carTitle}</h2>
        <p className="year">{carYear}</p>
        <p className="description">{carDescription}</p>
        <p className="price">{carPrice} Ksh</p>
        <Link to={`/admin/edit-car/${id}`}>Edit</Link>
        <button className="delete-btn" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

CarCard.propTypes = {
  carImg: PropTypes.string,
  carTitle: PropTypes.string,
  carYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  carPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  carDescription: PropTypes.string,
  id: PropTypes.string,
  onDelete: PropTypes.func,
};

export default CarCard;
