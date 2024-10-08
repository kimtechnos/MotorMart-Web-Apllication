import React from "react";
//import homeImage from "../../assets/mg6.png";
import homeImage from "../../assets/mg6.png";
import "./home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="secContainer">
        <div className="homeText">
          <span className="homeSpan">Meet your new car</span>
          <h1 className="homeTitle">MG6 Type </h1>
          <div className="btns">
            <button className="btn">More Details</button>
            <button className="btn primaryBtn">Test Drive</button>
          </div>
        </div>
      </div>
      <div className="homeImage">
        <img src={homeImage} alt="homeImage" />
      </div>
      <section className="search">
        <div className="secContainer container">
          <h3 className="title">Which vehicle are you looking for?</h3>
          <div className="searchDiv">
            <div className="inputWrapper">
              <label htmlFor="vehicleType">Type</label>
              <input type="text" id="vehicleType" placeholder="Type" />
            </div>
            <div className="inputWrapper">
              <label htmlFor="vehicleYear">Year</label>
              <input type="number" id="vehicleYear" placeholder="Year" />
            </div>
            <div className="inputWrapper">
              <label htmlFor="vehicleModel">Model</label>
              <input type="text" id="vehicleModel" placeholder="Model" />
            </div>
            <div className="inputWrapper">
              <label htmlFor="vehiclePrice">Price</label>
              <input type="number" id="vehiclePrice" placeholder="Price" />
            </div>
            <button className="btn primaryBtn">
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
