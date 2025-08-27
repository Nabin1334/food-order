import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Remove from "./pages/Remove/Remove";
<<<<<<< HEAD
import Dashboard from "./pages/Dashboard/Dashboard"; 
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

=======
import Dashboard from "./pages/Dashboard/Dashboard";
>>>>>>> 69ce5c034951b623785efe2710101c1210445943
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/remove" element={<Remove url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
