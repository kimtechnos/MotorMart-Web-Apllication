import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { apiBase } from "../../utils/config";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(`${apiBase}/api/cars/${id}`, { credentials: "include" })
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

  const handleInputs = (event) => {
    const { name, value } = event.target;
    setCar((current) => ({ ...current, [name]: value }));
  };

  const saveCar = async (event) => {
    event.preventDefault();
    setError("");
    const year = Number.parseInt(car.year, 10);
    const price = Number.parseFloat(car.price);
    if (Number.isNaN(year) || Number.isNaN(price)) {
      setError("Year and price must be numbers");
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          make: car.make,
          model: car.model,
          year,
          price,
          description: car.description,
          imageUrl: car.imageUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Unable to update vehicle");
        toast(data.message || "Unable to update vehicle", { theme: "failure" });
        return;
      }
      toast("Vehicle updated", { theme: "success" });
      navigate("/admin/manage-cars");
    } catch (saveError) {
      setError("Unable to update vehicle");
      toast("Unable to update vehicle", { theme: "failure" });
    }
  };

  if (status === "loading") {
    return <p>Loading vehicle...</p>;
  }
  if (status === "missing") {
    return <p>That vehicle is no longer listed.</p>;
  }
  if (status === "error" || !car) {
    return <p>Unable to load this vehicle.</p>;
  }

  return (
    <form className="addsalecarform" onSubmit={saveCar}>
      <h1>Edit vehicle</h1>
      <label htmlFor="make">Make</label>
      <input id="make" name="make" value={car.make} onChange={handleInputs} />
      <label htmlFor="model">Model</label>
      <input id="model" name="model" value={car.model} onChange={handleInputs} />
      <label htmlFor="year">Year</label>
      <input id="year" name="year" value={car.year} onChange={handleInputs} />
      <label htmlFor="price">Price</label>
      <input id="price" name="price" value={car.price} onChange={handleInputs} />
      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        value={car.description}
        onChange={handleInputs}
      />
      <label htmlFor="imageUrl">Image URL</label>
      <input
        id="imageUrl"
        name="imageUrl"
        value={car.imageUrl}
        onChange={handleInputs}
      />
      {error ? <p>{error}</p> : null}
      <button type="submit">Save</button>
      <Link to="/admin/manage-cars">Cancel</Link>
    </form>
  );
};

export default EditCar;
