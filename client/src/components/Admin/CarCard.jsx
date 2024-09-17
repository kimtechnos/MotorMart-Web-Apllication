import React from "react";

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
        <button className="delete-btn" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CarCard;
