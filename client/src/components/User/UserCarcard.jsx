import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./UserCarcard.css";

const UserCarcard = ({
  id,
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
      state: { carId: id, carMake, carModel },
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

UserCarcard.propTypes = {
  id: PropTypes.string,
  carImg: PropTypes.string,
  carMake: PropTypes.string,
  carModel: PropTypes.string,
  carYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  carPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  carDescription: PropTypes.string,
};

export default UserCarcard;
