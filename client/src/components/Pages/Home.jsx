import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import homeImage from "../../assets/mg6.png";
import "./home.css";

const validationSchema = yup.object({
  vehicleType: yup.string().required("Vehicle type is required"),
  vehicleYear: yup
    .number()
    .required("Vehicle year is required")
    .positive("Year must be positive")
    .integer("Year must be a valid number"),
  vehicleModel: yup.string().required("Vehicle model is required"),
  vehiclePrice: yup
    .number()
    .required("Vehicle price is required")
    .positive("Price must be positive"),
});

const Home = () => {
  const [submitting, setSubmitting] = useState(false);

  const handlesubmit = async (values) => {
    setSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted", values);
      setSubmitting(false);
    }, 2000);
  };

  const formik = useFormik({
    initialValues: {
      vehicleType: "",
      vehicleYear: "",
      vehicleModel: "",
      vehiclePrice: "",
    },
    validationSchema,
    onSubmit: handlesubmit,
  });

  return (
    <div className="home">
      <div className="secContainer">
        <div className="homeText">
          <span className="homeSpan">Meet your new car</span>
          <h1 className="homeTitle">MG6 Type</h1>
          <div className="btns">
            <button className="btn">More Details</button>
            <button className="btn primaryBtn">Test Drive</button>
          </div>
        </div>
      </div>
      <div className="homeImage">
        <img src={homeImage} alt="MG6 car model" />
      </div>
      <section className="search">
        <div className="secContainer container">
          <h3 className="title">Which vehicle are you looking for?</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="searchDiv">
              <div className="inputWrapper">
                <label htmlFor="vehicleType">Type</label>
                <input
                  type="text"
                  id="vehicleType"
                  name="vehicleType"
                  placeholder="Type"
                  value={formik.values.vehicleType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.vehicleType && formik.errors.vehicleType ? (
                  <div className="error">{formik.errors.vehicleType}</div>
                ) : null}
              </div>
              <div className="inputWrapper">
                <label htmlFor="vehicleYear">Year</label>
                <input
                  type="number"
                  id="vehicleYear"
                  name="vehicleYear"
                  placeholder="Year"
                  value={formik.values.vehicleYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.vehicleYear && formik.errors.vehicleYear ? (
                  <div className="error">{formik.errors.vehicleYear}</div>
                ) : null}
              </div>
              <div className="inputWrapper">
                <label htmlFor="vehicleModel">Model</label>
                <input
                  type="text"
                  id="vehicleModel"
                  name="vehicleModel"
                  placeholder="Model"
                  value={formik.values.vehicleModel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.vehicleModel && formik.errors.vehicleModel ? (
                  <div className="error">{formik.errors.vehicleModel}</div>
                ) : null}
              </div>
              <div className="inputWrapper">
                <label htmlFor="vehiclePrice">Price</label>
                <input
                  type="number"
                  id="vehiclePrice"
                  name="vehiclePrice"
                  placeholder="Price"
                  value={formik.values.vehiclePrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.vehiclePrice && formik.errors.vehiclePrice ? (
                  <div className="error">{formik.errors.vehiclePrice}</div>
                ) : null}
              </div>
              <button
                type="submit"
                className="btn primaryBtn"
                disabled={submitting}
              >
                {submitting ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
