"use client"

import { useState, useEffect } from "react"
import UnifiedAuth from "../../shared/components/UnifiedAuth/UnifiedAuth" // Adjust the import path as needed
frontend/components/UnifiedAuth/UnifiedAuth.jsx

import "./Navbar.css"


const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")
    const userData = localStorage.getItem("user")

    if (token && userRole === "admin" && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("user")
    setUser(null)
    window.location.reload()
  }

  const handleAuthClick = () => {
    setShowAuth(true)
  }

  const handleCloseAuth = () => {
    setShowAuth(false)
  }

  return (
    <>
      <div className="admin-navbar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
          <span>Food Plaza Management</span>
        </div>

        <div className="admin-nav-right">
          {!user || user.role !== "admin" ? (
            <button className="admin-auth-btn" onClick={handleAuthClick}>
              <i className="fas fa-user-shield"></i>
              Admin Login
            </button>
          ) : (
            <div className="admin-profile">
              <div className="admin-info">
                <i className="fas fa-user-shield"></i>
                <span className="admin-name">{user.name}</span>
                <span className="admin-badge">Admin</span>
              </div>
              <div className="admin-dropdown">
                <button onClick={() => window.open("http://localhost:5173", "_blank")}>
                  <i className="fas fa-home"></i>
                  Go to Website
                </button>
                <button onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAuth && <UnifiedAuth setShowLogin={handleCloseAuth} initialType="admin" />}
    </>
  )
}

export default Navbar
