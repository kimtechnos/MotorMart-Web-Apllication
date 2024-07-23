import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { apiBase } from "../../utils/config";
import UserCarcard from "./UserCarcard";

const ViewCar = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsResponse = await axios.get(`${apiBase}/api/cars`, {
          withCredentials: true,
        });
        setCars(carsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast("Failed to fetch data", { theme: "failure" });
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="section-user-cars">
    <h1>Available cars</h1>
    <div className="cars-list">
   
        {cars.map((car) => (
          <UserCarcard
            key={car.id}
            carImg={car.imageUrl}
            carTitle={`${car.make} ${car.model}`}
            carYear={car.year}
            carPrice={car.price}
            carDescription={car.description}
            id={car.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewCar;
