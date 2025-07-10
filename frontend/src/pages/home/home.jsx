import React, { useState } from "react";
import "./home.css"; // Importing the CSS file for styling
import Header from "../../components/header/header"; // Importing the Header component
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu"; // Importing the ExploreMenu component

import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import PlaceOrder from "../PlaceOrder/PlaceOrder"; // Importing the AppDownload component

const Home = () => {
  const [category, setCategory] = useState("All"); // State to manage the category

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      {/* <PlaceOrder/> */}
       
      <AppDownload />
       
    </div>
  );
};

export default Home;
