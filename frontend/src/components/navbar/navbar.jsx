"use client"

import { useContext, useState } from "react"
import "./Navbar.css"
import { assets } from "../../assets/assets"
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from "../../context/StoreContext"
import UnifiedAuth from "../UnifiedAuth/UnifiedAuth"

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home")
  const [showAuth, setShowAuth] = useState(false)
  const [authType, setAuthType] = useState("user")

  const { getTotalCartAmount, getCartCount, token, setToken, user } = useContext(StoreContext)

  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("user")
    setToken("")
    navigate("/")
  }

  const handleClick = () => {
    if (!token) {
      setShowLogin(true)
    } else {
      navigate("/myorders")
    }
  }

  const handleAuthClick = (type) => {
    setAuthType(type)
    setShowAuth(true)
  }

  return (
    <>
      <div className="navbar">
        <Link to="/" className="brand">
          <h1 className="brandName1">
            Food<span className="brandName2">Plaza</span>
          </h1>
        </Link>

        <ul className="navbar-menu">
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
            Home
          </Link>
          <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
            Menu
          </a>
          <a
            href="#app-download"
            onClick={() => setMenu("mobile-app")}
            className={menu === "mobile-app" ? "active" : ""}
          >
            Mobile-app
          </a>
          <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
            Contact us
          </a>
        </ul>

        <div className="navbar-right">
          <img src={assets.search_icon || "/placeholder.svg"} alt="" />
          <div className="navbar-search-icon">
            <Link to="/cart">
              <img src={assets.basket_icon || "/placeholder.svg"} alt="" />
              {getCartCount && getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>

          {!token ? (
            <div className="auth-buttons">
              <button className="user-login-btn" onClick={() => handleAuthClick("user")}>
                <img src={assets.profile_icon || "/placeholder.svg"} alt="" />
                Sign In
              </button>
              <button className="admin-login-btn" onClick={() => handleAuthClick("admin")}>
                <i className="fas fa-user-shield"></i>
                Admin
              </button>
            </div>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon || "/placeholder.svg"} alt="" />
              <span className="user-name">{user?.name}</span>
              {user?.role === "admin" && <span className="admin-badge">Admin</span>}

              <ul className="nav-profile-dropdown">
                {user?.role === "admin" && (
                  <>
                    <li onClick={() => window.open("http://localhost:5174", "_blank")}>
                      <img src={assets.bag_icon || "/placeholder.svg"} alt="" />
                      <p>Admin Panel</p>
                    </li>
                    <hr />
                  </>
                )}
                <li onClick={() => navigate("/myorders")}>
                  <img src={assets.bag_icon || "/placeholder.svg"} alt="" />
                  <p onClick={handleClick}>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon || "/placeholder.svg"} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {showAuth && <UnifiedAuth setShowLogin={setShowAuth} initialType={authType} />}
    </>
  )
}

export default Navbar
