import React from "react";
const UserCarcard = ({ carImg, carTitle, carYear, carPrice, carDescription }) => {
  return (
    <div className="car-card">
      <div className="car-img">
        <img src={carImg} alt={carTitle} />
      </div>
      <div className="car-info">
        <h2>{carTitle}</h2>
        <p className="year">{carYear}</p>
        <p className="description">{carDescription}</p>
        <p className="price">{carPrice} $</p>
      </div>
    </div>
  );
};

export default UserCarcard;
