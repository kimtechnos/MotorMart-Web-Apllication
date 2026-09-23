import { useState } from "react";
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
        toast("Car added successfully!", { theme: "success" });
      } else {
        const data = await response.json();
        console.log("Error response data:", data);
        setError(data.message);
        toast(data.message || "Failed to add car", { theme: "failure" });
      }
    } catch (error) {
      console.error("Error adding car:", error);
      setError("Error adding car");
      toast("Error adding car", { theme: "failure" });
    }
  };

  return (
    <div className="form-page">
      <div className="admin-add-car-title">
        <h1>Add a vehicle</h1>
        <p className="muted">Listings appear on the public catalog after you save.</p>
      </div>
      <form className="addsalecarform panel" name="myform" id="myform" onSubmit={postData}>
        <fieldset>
          <legend>Vehicle details</legend>
          <label htmlFor="make">
            Make
            <input
              type="text"
              name="make"
              id="make"
              value={car.make}
              onChange={handleInputs}
              placeholder="Toyota"
            />
          </label>
          <label htmlFor="model">
            Model
            <input
              type="text"
              name="model"
              id="model"
              value={car.model}
              onChange={handleInputs}
              placeholder="Axio"
            />
          </label>
          <label htmlFor="year">
            Year
            <input
              type="text"
              name="year"
              id="year"
              value={car.year}
              onChange={handleInputs}
              placeholder="2020"
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Price and description</legend>
          <label htmlFor="price">
            Price
            <input
              type="text"
              name="price"
              id="price"
              value={car.price}
              onChange={handleInputs}
              placeholder="1500000"
            />
          </label>
          <label htmlFor="description">
            Description
            <input
              type="text"
              name="description"
              id="description"
              value={car.description}
              onChange={handleInputs}
              placeholder="Short description"
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Photo</legend>
          <label htmlFor="imageInput">
            Image
            <ImageUpload onUpload={handleImageUpload} />
          </label>
          {car.imageUrl ? (
            <div id="image-container">
              <img src={car.imageUrl} alt="Uploaded car" />
            </div>
          ) : (
            <p className="muted">Upload a photo before saving if you want one on the listing.</p>
          )}
        </fieldset>
        {error ? <p className="error">{error}</p> : null}
        <div className="button">
          <input type="submit" name="submit" value="Add Car" className="btn" />
        </div>
      </form>
    </div>
  );
};

export default ManageCars;
