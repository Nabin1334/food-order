import React from "react"
import { useContext, useState, useEffect } from "react"
import { StoreContext } from "../../context/StoreContext"
import axios from "axios"
import "./PaymentAutomation.css"


const PaymentAutomation = ({ orderData, onPaymentComplete }) => {
  const { url, token, user } = useContext(StoreContext)
  const [paymentMethod, setPaymentMethod] = useState("esewa")
  const [processing, setProcessing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "Nepal",
  })

  useEffect(() => {
    if (user) {
      setUserInfo({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipcode: user.address?.zipcode || "",
        country: user.address?.country || "Nepal",
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const processPayment = async () => {
    setProcessing(true)
    try {
      const paymentData = {
        ...orderData,
        address: userInfo,
        paymentMethod,
        userInfo,
      }

      const response = await axios.post(`${url}/api/payment/process`, paymentData, {
        headers: { token },
      })

      if (response.data.success) {
        if (paymentMethod === "esewa") {
          window.location.href = response.data.esewaUrl
        } else if (paymentMethod === "khalti") {
          window.location.href = response.data.khaltiUrl
        }
        onPaymentComplete(response.data)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error("Payment processing error:", error)
      alert("Payment processing failed. Please try again.")
    }
    setProcessing(false)
  }

  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "phone", "street", "city"]
    return required.every((field) => userInfo[field]?.trim())
  }

  return (
    <div className="payment-automation">
      <div className="payment-container">
        <div className="payment-header">
          <h2>Secure Payment</h2>
          <p>Complete your order with automated payment processing</p>
        </div>

        <div className="payment-content">
          <div className="user-info-section">
            <h3>Delivery Information</h3>
            <div className="info-grid">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="input-group full-width">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={userInfo.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={userInfo.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="input-group">
                <label>State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={userInfo.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                />
              </div>
              <div className="input-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipcode"
                  value={userInfo.zipcode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Payment Method</h3>
            <div className="methods-grid">
              <div
                className={`payment-option ${paymentMethod === "esewa" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("esewa")}
              >
                <div className="option-header">
                  <img src="/placeholder.svg?height=40&width=120&text=eSewa" alt="eSewa" />
                  <div className="option-info">
                    <h4>eSewa</h4>
                    <p>Digital wallet payment</p>
                  </div>
                </div>
                <div className="option-features">
                  <span>✓ Instant payment</span>
                  <span>✓ Secure & trusted</span>
                  <span>✓ No extra charges</span>
                </div>
              </div>

              <div
                className={`payment-option ${paymentMethod === "khalti" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("khalti")}
              >
                <div className="option-header">
                  <img src="/placeholder.svg?height=40&width=120&text=Khalti" alt="Khalti" />
                  <div className="option-info">
                    <h4>Khalti</h4>
                    <p>Digital wallet payment</p>
                  </div>
                </div>
                <div className="option-features">
                  <span>✓ Quick & easy</span>
                  <span>✓ Bank transfer</span>
                  <span>✓ Mobile banking</span>
                </div>
              </div>

              <div
                className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="option-header">
                  <i className="fas fa-money-bill-wave payment-icon"></i>
                  <div className="option-info">
                    <h4>Cash on Delivery</h4>
                    <p>Pay when you receive</p>
                  </div>
                </div>
                <div className="option-features">
                  <span>✓ No advance payment</span>
                  <span>✓ Pay at doorstep</span>
                  <span>✓ Cash or card</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs.{orderData.amount}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>Rs.{orderData.deliveryFee}</span>
              </div>
              <div className="summary-row">
                <span>Tax (13%)</span>
                <span>Rs.{orderData.tax}</span>
              </div>
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-Rs.{orderData.discount || 0}</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>Rs.{orderData.finalAmount}</span>
              </div>
            </div>
          </div>

          <div className="security-info">
            <div className="security-badges">
              <div className="security-badge">
                <i className="fas fa-shield-alt"></i>
                <span>SSL Encrypted</span>
              </div>
              <div className="security-badge">
                <i className="fas fa-lock"></i>
                <span>Secure Payment</span>
              </div>
              <div className="security-badge">
                <i className="fas fa-user-shield"></i>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>

          <button className="payment-btn" onClick={processPayment} disabled={!validateForm() || processing}>
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Processing Payment...
              </>
            ) : (
              <>
                <i className="fas fa-credit-card"></i>
                Complete Payment - Rs.{orderData.finalAmount}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentAutomation
