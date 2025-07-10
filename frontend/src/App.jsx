import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import Cart from "./pages/Cart/cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import "./App.css";



import Loginpopup from "./components/Loginpopup/Loginpopup";
import Footer from "./components/Footer/Footer";
import { StoreContext } from './context/StoreContext';
// import { useContext } from 'react'
import  MyOrders from "./pages/MyOrders/MyOrders.jsx";




const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <Loginpopup setShowLogin={setShowLogin} /> : <></>}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          {/* <Route path="/verify" element={<Verify />} /> */}
              
         
          <Route path="/myorders" element={<MyOrders />} />
          
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
