import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../../context/StoreContext"
import axios from "axios"
import "./UnifiedAuth.css"

const UnifiedAuth = ({ setShowAuth, initialType = "user" }) => {
  const { url, setToken, setUser } = useContext(StoreContext)
  const navigate = useNavigate()

  const [authState, setAuthState] = useState("Login")
  const [loginType, setLoginType] = useState(initialType) // 'user' or 'admin'
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => ({ ...data, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    // Validation
    if (authState === "Sign Up" && data.password !== data.confirmPassword) {
      alert("Passwords don't match!")
      setLoading(false)
      return
    }

    let newUrl = url
    if (authState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    try {
      const requestData = {
        ...data,
        loginType: loginType,
        role: authState === "Sign Up" ? loginType : undefined,
      }

      const response = await axios.post(newUrl, requestData)

      if (response.data.success) {
        setToken(response.data.token)
        setUser(response.data.user)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userRole", response.data.user.role)

        setShowAuth(false)

        // Redirect based on role
        if (response.data.user.role === "admin") {
          window.location.href = "http://localhost:5174" // Admin panel URL
        } else {
          navigate("/")
        }
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error("Auth error:", error)
      alert("Authentication failed. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="unified-auth-overlay">
      <div className="unified-auth-container">
        <div className="auth-header">
          <h2>
            {authState} as {loginType === "admin" ? "Admin" : "User"}
          </h2>
          <button className="close-btn" onClick={() => setShowAuth(false)}>
            ×
          </button>
        </div>

        <div className="auth-type-selector">
          <button className={loginType === "user" ? "active" : ""} onClick={() => setLoginType("user")}>
            <i className="fas fa-user"></i>
            User Login
          </button>
          <button className={loginType === "admin" ? "active" : ""} onClick={() => setLoginType("admin")}>
            <i className="fas fa-user-shield"></i>
            Admin Login
          </button>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          {authState === "Sign Up" && (
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {authState === "Sign Up" && (
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                name="confirmPassword"
                onChange={onChangeHandler}
                value={data.confirmPassword}
                type="password"
                placeholder="Confirm Password"
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <div className="loading-spinner"></div> : authState === "Sign Up" ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          {authState === "Login" ? (
            <p>
              Don't have an account?
              <span onClick={() => setAuthState("Sign Up")}> Sign Up</span>
            </p>
          ) : (
            <p>
              Already have an account?
              <span onClick={() => setAuthState("Login")}> Login</span>
            </p>
          )}
        </div>

        {loginType === "admin" && (
          <div className="admin-info">
            <i className="fas fa-info-circle"></i>
            <p>Admin access required for management features</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnifiedAuth
