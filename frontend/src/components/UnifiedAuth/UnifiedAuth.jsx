import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./UnifiedAuth.css";

const UnifiedAuth = ({ setShowAuth, initialType = "user" }) => {
  const { url, setToken, setUser } = useContext(StoreContext);
  const navigate = useNavigate();

  const [authState, setAuthState] = useState("Login");
  const [loginType, setLoginType] = useState(initialType); // 'user' or 'admin'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setLoginType(initialType);
  }, [initialType]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((d) => ({ ...d, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (authState === "Sign Up" && data.password !== data.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (!url) {
      setError("Server URL not configured.");
      setLoading(false);
      return;
    }

    let newUrl = url;
    if (authState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const requestData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: authState === "Sign Up" ? loginType : undefined,
        loginType: loginType,
      };

      const response = await axios.post(newUrl, requestData);

      if (response?.data?.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // close modal
        setShowAuth(false);

        // Redirect based on role
        if (response.data.user.role === "admin") {
          // open admin panel
          window.location.href = "http://localhost:5174";
        } else {
          navigate("/");
        }
      } else {
        setError(response?.data?.message || "Authentication failed.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err?.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Close on overlay click or Escape
  const onOverlayClick = (e) => {
    // close only if user clicked overlay (not inside container)
    if (
      e.target.classList &&
      e.target.classList.contains("unified-auth-overlay")
    ) {
      setShowAuth(false);
    }
  };

  const escHandler = useCallback(
    (e) => {
      if (e.key === "Escape") setShowAuth(false);
    },
    [setShowAuth]
  );

  useEffect(() => {
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [escHandler]);

  return (
    <div className="unified-auth-overlay" onClick={onOverlayClick}>
      <div
        className="unified-auth-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-header">
          <h2>
            {authState} as {loginType === "admin" ? "Admin" : "User"}
          </h2>
          <button className="close-btn" onClick={() => setShowAuth(false)}>
            ×
          </button>
        </div>

        <div className="auth-type-selector">
          <button
            className={loginType === "user" ? "active" : ""}
            onClick={() => setLoginType("user")}
          >
            <i className="fas fa-user"></i>
            User Login
          </button>
          <button
            className={loginType === "admin" ? "active" : ""}
            onClick={() => setLoginType("admin")}
          >
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

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-actions">
            <button
              type="button"
              className="auth-back-btn"
              onClick={() => setShowAuth(false)}
            >
              Back
            </button>
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : authState === "Sign Up" ? (
                "Create Account"
              ) : (
                "Login"
              )}
            </button>
          </div>
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
  );
};

export default UnifiedAuth;
