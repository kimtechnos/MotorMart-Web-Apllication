import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiBase } from "../../utils/config";
import homeImage from "../../assets/mg6.png";
import "./home.css";

const filtersFromParams = (searchParams) => ({
  make: searchParams.get("make") || "",
  model: searchParams.get("model") || "",
  year: searchParams.get("year") || "",
  maxPrice: searchParams.get("maxPrice") || "",
});

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState(() => filtersFromParams(searchParams));
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams();
    ["make", "model", "year", "maxPrice"].forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        params.set(key, value);
      }
    });

    let cancelled = false;
    setStatus("loading");

    fetch(`${apiBase}/api/cars?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load vehicles");
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        setCars(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        next[key] = value;
      }
    });
    setSearchParams(next);
  };

  return (
    <div className="home">
      <div className="secContainer">
        <div className="homeText">
          <span className="homeSpan">Meet your new car</span>
          <h1 className="homeTitle">MotorMart</h1>
          <div className="btns">
            <a className="btn" href="#vehicle-search">
              More Details
            </a>
            <a className="btn primaryBtn" href="#vehicle-search">
              Search inventory
            </a>
          </div>
        </div>
      </div>
      <div className="homeImage">
        <img src={homeImage} alt="MG6 car model" />
      </div>
      <section className="search" id="vehicle-search">
        <div className="secContainer container">
          <h3 className="title">Which vehicle are you looking for?</h3>
          <form onSubmit={handleSubmit}>
            <div className="searchDiv">
              <div className="inputWrapper">
                <label htmlFor="make">Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  placeholder="Make"
                  value={form.make}
                  onChange={handleChange}
                />
              </div>
              <div className="inputWrapper">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  placeholder="Model"
                  value={form.model}
                  onChange={handleChange}
                />
              </div>
              <div className="inputWrapper">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  placeholder="Year"
                  value={form.year}
                  onChange={handleChange}
                />
              </div>
              <div className="inputWrapper">
                <label htmlFor="maxPrice">Max price</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder="Max price"
                  value={form.maxPrice}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn primaryBtn">
                Search
              </button>
            </div>
          </form>
          <div className="search-results" aria-live="polite">
            {status === "loading" ? <p>Loading vehicles...</p> : null}
            {status === "error" ? <p>Unable to load vehicles.</p> : null}
            {status === "ready" && cars.length === 0 ? (
              <p>No vehicles match your search.</p>
            ) : null}
            {status === "ready"
              ? cars.map((car) => (
                  <article key={car.id} className="search-result">
                    <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
                    <h2>
                      {car.make} {car.model}
                    </h2>
                    <p>
                      {car.year} · {car.price} Ksh
                    </p>
                    <Link to={`/cars/${car.id}`}>View details</Link>
                  </article>
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
