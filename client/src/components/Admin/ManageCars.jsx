import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { apiBase } from "../../utils/config";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";

const ManageCars = () => {
  const [car, setCar] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  const handleImageUpload = (url) => {
    setCar({ ...car, imageUrl: url });
  };

  const postData = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Submitting form with data:", car); 

    try {
      const response = await fetch(`${apiBase}/api/cars/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(car),
        credentials: "include",
      });

      console.log("Response received:", response);

      if (response.ok) {
        console.log("Car added successfully!");
        toast("Car added successfully!", {theme:"success"});
      } else {
        const data = await response.json();
        console.log("Error response data:", data);
        setError(data.message );
        toast(data.message || "Failed to add car", {theme:"failure"});
      }
    } catch (error) {
      console.error("Error adding car:", error);
      setError("Error adding car");
      toast("Error adding car", {theme:"failure"});
    }
  };

  return (
    <>
      <div className="admin-add-car-title">Add Cars For Sale</div>
      <form
        className="addsalecarform"
        name="myform"
        id="myform"
        onSubmit={postData}
      >
        <label htmlFor="make">Make: </label>
        <input
          type="text"
          name="make"
          id="make"
          value={car.make}
          onChange={handleInputs}
          placeholder="Enter Car Make"
        />
        <br />
        <label htmlFor="model">Model: </label>
        <input
          type="text"
          name="model"
          id="model"
          value={car.model}
          onChange={handleInputs}
          placeholder="Enter Car Model"
        />
        <br />
        <label htmlFor="year">Year: </label>
        <input
          type="text"
          name="year"
          id="year"
          value={car.year}
          onChange={handleInputs}
          placeholder="Manufacturing Year"
        />
        <br />
        <label htmlFor="price">Price: </label>
        <input
          type="text"
          name="price"
          id="price"
          value={car.price}
          onChange={handleInputs}
          placeholder="Enter Car Price"
        />
        <br />
        <label htmlFor="description">Description: </label>
        <input
          type="text"
          name="description"
          id="description"
          value={car.description}
          onChange={handleInputs}
          placeholder="Enter Car Description"
        />
        <br />
        <label htmlFor="imageUrl">Image URL: </label>
        <ImageUpload onUpload={handleImageUpload} />
        {car.imageUrl && (
          <div id="image-container">
            <img
              src={car.imageUrl}
              alt="Uploaded Car"
              style={{ maxWidth: "50%", border: "solid red" }}
            />
          </div>
        )}
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="button">
          <input type="submit" name="submit" value="Add Car" />
        </div>
      </form>
    </>
  );
};

export default ManageCars;
