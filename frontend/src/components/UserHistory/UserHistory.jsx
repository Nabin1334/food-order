import React from "react"
import { useContext, useEffect, useState } from "react"
import { StoreContext } from "../../context/StoreContext"
import axios from "axios"
import "./UserHistory.css"


const UserHistory = () => {
  const { url, token } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    avgOrderValue: 0,
    favoriteItems: [],
  })

  useEffect(() => {
    if (token) {
      fetchUserHistory()
      fetchUserStats()
    }
  }, [token, filter, sortBy, dateRange])

  const fetchUserHistory = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filter !== "all") queryParams.append("status", filter)
      if (sortBy) queryParams.append("sortBy", sortBy)
      if (dateRange.start) queryParams.append("startDate", dateRange.start)
      if (dateRange.end) queryParams.append("endDate", dateRange.end)

      const response = await axios.get(`${url}/api/order/userorders?${queryParams}`, {
        headers: { token },
      })

      if (response.data.success) {
        setOrders(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching user history:", error)
    }
    setLoading(false)
  }

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${url}/api/user/stats`, {
        headers: { token },
      })

      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const reorderItems = async (orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/reorder`, { orderId }, { headers: { token } })

      if (response.data.success) {
        alert("Items added to cart successfully!")
      }
    } catch (error) {
      console.error("Error reordering:", error)
      alert("Failed to reorder items")
    }
  }

  const rateOrder = async (orderId, rating, review) => {
    try {
      const response = await axios.post(`${url}/api/order/rate`, { orderId, rating, review }, { headers: { token } })

      if (response.data.success) {
        fetchUserHistory()
        alert("Thank you for your feedback!")
      }
    } catch (error) {
      console.error("Error rating order:", error)
      alert("Failed to submit rating")
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (searchTerm) {
      return (
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order._id.includes(searchTerm)
      )
    }
    return true
  })

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      confirmed: "#17a2b8",
      preparing: "#fd7e14",
      out_for_delivery: "#6f42c1",
      delivered: "#28a745",
      cancelled: "#dc3545",
    }
    return colors[status] || "#6c757d"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="user-history loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your order history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-history">
      <div className="history-header">
        <div className="header-content">
          <h1>My Order History</h1>
          <p>Track and manage all your past orders</p>
        </div>

        <div className="user-stats">
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
              <h3>Rs.{stats.totalSpent?.toLocaleString()}</h3>
              <p>Total Spent</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-receipt"></i>
            </div>
            <div className="stat-info">
              <h3>Rs.{stats.avgOrderValue?.toFixed(0)}</h3>
              <p>Avg Order Value</p>
            </div>
          </div>
        </div>
      </div>

      <div className="history-filters">
        <div className="filter-row">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search orders by item name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        <div className="date-filters">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            placeholder="End Date"
          />
          <button
            className="clear-filters"
            onClick={() => {
              setSearchTerm("")
              setFilter("all")
              setSortBy("date")
              setDateRange({ start: "", end: "" })
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {stats.favoriteItems?.length > 0 && (
        <div className="favorite-items">
          <h3>Your Favorite Items</h3>
          <div className="favorites-grid">
            {stats.favoriteItems.map((item, index) => (
              <div key={index} className="favorite-item">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Ordered {item.count} times</p>
                  <span className="price">Rs.{item.price}</span>
                </div>
                <button className="reorder-btn" onClick={() => reorderItems(item._id)}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <i className="fas fa-shopping-bag"></i>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet or no orders match your filters.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order, index) => (
              <div key={index} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </span>
                    <div className="order-amount">Rs.{order.finalAmount}</div>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items Ordered:</h4>
                  <div className="items-grid">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="order-item">
                        <img
                          src={`${url}/images/${item.image}`}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=60&width=60&text=Food"
                          }}
                        />
                        <div className="item-details">
                          <h5>{item.name}</h5>
                          <p>
                            Qty: {item.quantity} × Rs.{item.price}
                          </p>
                          <span className="item-total">Rs.{item.quantity * item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span>Payment Method:</span>
                    <span>{order.paymentMethod || "eSewa"}</span>
                  </div>
                  <div className="detail-row">
                    <span>Payment Status:</span>
                    <span className={`payment-status ${order.paymentStatus}`}>{order.paymentStatus}</span>
                  </div>
                  {order.estimatedDeliveryTime && (
                    <div className="detail-row">
                      <span>Estimated Delivery:</span>
                      <span>{formatDate(order.estimatedDeliveryTime)}</span>
                    </div>
                  )}
                  {order.actualDeliveryTime && (
                    <div className="detail-row">
                      <span>Delivered At:</span>
                      <span>{formatDate(order.actualDeliveryTime)}</span>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button className="action-btn reorder" onClick={() => reorderItems(order._id)}>
                    <i className="fas fa-redo"></i>
                    Reorder
                  </button>

                  {order.status === "delivered" && !order.rating && (
                    <button
                      className="action-btn rate"
                      onClick={() => {
                        const rating = prompt("Rate this order (1-5 stars):")
                        const review = prompt("Leave a review (optional):")
                        if (rating && rating >= 1 && rating <= 5) {
                          rateOrder(order._id, Number.parseInt(rating), review || "")
                        }
                      }}
                    >
                      <i className="fas fa-star"></i>
                      Rate Order
                    </button>
                  )}

                  {order.rating && (
                    <div className="order-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={i < order.rating ? "fas fa-star" : "far fa-star"}></i>
                        ))}
                      </div>
                      {order.review && <p className="review-text">"{order.review}"</p>}
                    </div>
                  )}

                  <button className="action-btn track">
                    <i className="fas fa-map-marker-alt"></i>
                    Track Order
                  </button>

                  <button className="action-btn receipt">
                    <i className="fas fa-receipt"></i>
                    View Receipt
                  </button>
                </div>

                {order.status !== "cancelled" && (
                  <div className="order-timeline">
                    <div
                      className={`timeline-step ${["pending", "confirmed", "preparing", "out_for_delivery", "delivered"].indexOf(order.status) >= 0 ? "completed" : ""}`}
                    >
                      <div className="step-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <span>Order Placed</span>
                    </div>
                    <div
                      className={`timeline-step ${["confirmed", "preparing", "out_for_delivery", "delivered"].indexOf(order.status) >= 0 ? "completed" : ""}`}
                    >
                      <div className="step-icon">
                        <i className="fas fa-check"></i>
                      </div>
                      <span>Confirmed</span>
                    </div>
                    <div
                      className={`timeline-step ${["preparing", "out_for_delivery", "delivered"].indexOf(order.status) >= 0 ? "completed" : ""}`}
                    >
                      <div className="step-icon">
                        <i className="fas fa-utensils"></i>
                      </div>
                      <span>Preparing</span>
                    </div>
                    <div
                      className={`timeline-step ${["out_for_delivery", "delivered"].indexOf(order.status) >= 0 ? "completed" : ""}`}
                    >
                      <div className="step-icon">
                        <i className="fas fa-truck"></i>
                      </div>
                      <span>Out for Delivery</span>
                    </div>
                    <div className={`timeline-step ${order.status === "delivered" ? "completed" : ""}`}>
                      <div className="step-icon">
                        <i className="fas fa-home"></i>
                      </div>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserHistory
