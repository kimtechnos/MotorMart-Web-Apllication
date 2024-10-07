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
          <h1 className="homeTitle">MG6 Typr new</h1>
          <div className="btns">
            <button className="btn">More Details</button>
            <button className="btn primaryBtn">Test Drive</button>
          </div>
        </div>
      </div>
      <div className="homeImage">
        <img src={homeImage} alt="homeImage" />
      </div>
    </div>
  );
};

export default Home;
