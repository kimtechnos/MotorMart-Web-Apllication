import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { apiBase } from "../../utils/config";
import UserCarcard from "./UserCarcard";

const ViewCar = () => {
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsResponse = await axios.get(`${apiBase}/api/cars`, {
          withCredentials: true,
        });
        setCars(Array.isArray(carsResponse.data) ? carsResponse.data : []);
        setStatus("ready");
      } catch {
        setStatus("error");
        toast("Unable to load vehicles", { theme: "failure" });
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="section-user-cars">
      <h1>Drive in Style: Our Showroom Highlights</h1>
      {status === "loading" ? <p>Loading vehicles...</p> : null}
      {status === "error" ? <p>Unable to load vehicles.</p> : null}
      {status === "ready" && cars.length === 0 ? <p>No vehicles yet.</p> : null}
      <div className="cars-list">
        {cars.map((car) => (
          <UserCarcard
            key={car.id}
            id={car.id}
            carImg={car.imageUrl}
            carMake={car.make}
            carModel={car.model}
            carYear={car.year}
            carPrice={car.price}
            carDescription={car.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewCar;
