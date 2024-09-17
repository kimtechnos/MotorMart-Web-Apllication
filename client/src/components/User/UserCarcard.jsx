import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserCarcard.css";

const UserCarcard = ({
  carImg,
  carMake,
  carModel,
  carYear,
  carPrice,
  carDescription,
}) => {
  const navigate = useNavigate();

  const handleInquiryClick = () => {
    navigate("/user/post-inquiry", {
      state: { carMake, carModel },
    });
  };

  return (
    <div className="user-car-card" onClick={handleInquiryClick}>
      <div className="user-car-img">
        <img src={carImg} alt={`${carMake} ${carModel}`} />
      </div>
      <div className="car-info">
        <h2>{carMake}</h2>
        <h4>{carModel}</h4>
        <p className="year">{carYear}</p>
        <p className="description">{carDescription}</p>
        <p className="price">{carPrice}ksh</p>
      </div>
    </div>
  );
};

export default UserCarcard;
