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

const formatPrice = (price) => {
  const amount = Number(price);
  if (Number.isNaN(amount)) {
    return `${price} Ksh`;
  }
  return `${amount.toLocaleString("en-KE")} Ksh`;
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState(() => filtersFromParams(searchParams));
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("loading");
  const [retry, setRetry] = useState(0);

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
  }, [searchParams, retry]);

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
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="badge">Vehicle marketplace</p>
          <h1>Find a car, then ask about that exact listing.</h1>
          <p className="lede">
            MotorMart is a catalog of vehicles you can search by make, model,
            year, or budget. Every inquiry stays attached to one car.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#vehicle-search">
              Browse cars
            </a>
            <Link className="btn secondary" to="/about">
              How it works
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src={homeImage} alt="MG6 parked in profile" />
        </div>
      </section>

      <section className="search wrap panel" id="vehicle-search">
        <div className="section-heading">
          <h2>Search the inventory</h2>
          <p className="muted">Leave a field blank if you do not want to filter by it.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="search-form">
            <div className="field">
              <label htmlFor="make">Make</label>
              <input
                type="text"
                id="make"
                name="make"
                placeholder="Toyota"
                value={form.make}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                placeholder="Axio"
                value={form.model}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                placeholder="2020"
                value={form.year}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="maxPrice">Max price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="1500000"
                value={form.maxPrice}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn">
              Search
            </button>
          </div>
        </form>

        <div className="search-results" aria-live="polite">
          {status === "loading" ? (
            <div className="catalog-grid" aria-busy="true">
              <p className="sr-only">Loading vehicles...</p>
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ) : null}
          {status === "error" ? (
            <div className="empty-state">
              <p>We couldn&apos;t load vehicles. Try again.</p>
              <button type="button" className="btn" onClick={() => setRetry((n) => n + 1)}>
                Try again
              </button>
            </div>
          ) : null}
          {status === "ready" && cars.length === 0 ? (
            <p className="empty-state">No vehicles match your search.</p>
          ) : null}
          {status === "ready" && cars.length > 0 ? (
            <div className="catalog-grid">
              {cars.map((car) => (
                <article key={car.id} className="vehicle-card">
                  <img
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    loading="lazy"
                  />
                  <div className="vehicle-card-body">
                    <h2>
                      {car.make} {car.model}
                    </h2>
                    <p>
                      {car.year} · {formatPrice(car.price)}
                    </p>
                    <Link className="btn secondary" to={`/cars/${car.id}`}>
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="steps wrap">
        <h2>How MotorMart works</h2>
        <ol>
          <li>
            <strong>Search the catalog.</strong>
            <span>Filter by make, model, year, or a maximum price.</span>
          </li>
          <li>
            <strong>Open one vehicle.</strong>
            <span>Review the photo, year, price, and description.</span>
          </li>
          <li>
            <strong>Send an inquiry.</strong>
            <span>Create an account so the message stays tied to that car.</span>
          </li>
        </ol>
      </section>
    </div>
  );
};

export default Home;
