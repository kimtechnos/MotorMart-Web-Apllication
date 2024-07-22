import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { apiBase } from "../../utils/config";
import CarCard from "./CarCard";

const ManageCars = () => {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/api/cars/${id}`, {
        withCredentials: true,
      });
      setCars(cars.filter((car) => car.id !== id));
      toast("Car deleted successfully", { theme: "success" });
    } catch (error) {
      console.error("Error deleting car", error);
      toast("Error deleting car", { theme: "failure" });
    }
  };

  return (
    <div>
      <div className="cars-list">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            carImg={car.imageUrl}
            carTitle={`${car.make} ${car.model}`}
            carYear={car.year}
            carPrice={car.price}
            carDescription={car.description}
            id={car.id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageCars;
