import React from 'react';
import { useEffect, useState } from "react"
import axios from "axios"
import "./Dashboard.css"
import assets from '../../assets/assets';
import { toast } from "react-toastify";


const Dashboard = ({ url }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchStats()
    fetchRecentOrders()
  }, [])

  const fetchStats = async () => {
    try {
      const ordersResponse = await axios.get(url + "/api/order/list")
      const foodResponse = await axios.get(url + "/api/food/list")

      const orders = ordersResponse.data.data
      const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)

      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalUsers: new Set(orders.map((order) => order.userId)).size,
        totalProducts: foodResponse.data.data.length,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list")
      setRecentOrders(response.data.data.slice(0, 5))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>Rs.{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <div className="orders-table">
          <div className="orders-table-header">
            <p>Order ID</p>
            <p>Customer</p>
            <p>Amount</p>
            <p>Status</p>
            <p>Date</p>
          </div>
          {recentOrders.map((order, index) => (
            <div key={index} className="orders-table-row">
              <p>{order._id.slice(-6)}</p>
              <p>
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>Rs.{order.amount}</p>
              <p className={`status ${order.status.toLowerCase().replace(" ", "-")}`}>{order.status}</p>
              <p>{new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
