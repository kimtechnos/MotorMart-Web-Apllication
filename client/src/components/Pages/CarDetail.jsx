import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiBase } from "../../utils/config";
import "./home.css";

const formatPrice = (price) => {
  const amount = Number(price);
  if (Number.isNaN(amount)) {
    return `${price} Ksh`;
  }
  return `${amount.toLocaleString("en-KE")} Ksh`;
};

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetch(`${apiBase}/api/cars/${id}`)
      .then(async (response) => {
        if (response.status === 404) {
          return null;
        }
        if (!response.ok) {
          throw new Error("Unable to load vehicle");
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        setCar(data);
        setStatus(data ? "ready" : "missing");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return <p className="car-detail-status">Loading vehicle...</p>;
  }
  if (status === "missing") {
    return <p className="car-detail-status">That vehicle is no longer listed.</p>;
  }
  if (status === "error" || !car) {
    return <p className="car-detail-status">Unable to load this vehicle.</p>;
  }

  return (
    <article className="car-detail">
      <div className="car-detail-media panel">
        <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
      </div>
      <div className="car-detail-copy panel" style={{ padding: "2.4rem" }}>
        <p className="badge">{car.year}</p>
        <h1>
          {car.make} {car.model}
        </h1>
        <p className="car-detail-price">{formatPrice(car.price)}</p>
        <p>{car.description}</p>
        <button
          type="button"
          className="btn"
          onClick={() =>
            navigate("/user/post-inquiry", {
              state: { carId: car.id, carMake: car.make, carModel: car.model },
            })
          }
        >
          Send an inquiry
        </button>
        <p className="muted">An account is required before the message is sent.</p>
      </div>
    </article>
  );
};

export default CarDetail;
