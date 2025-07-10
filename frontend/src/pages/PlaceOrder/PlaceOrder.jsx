import React, { useContext, useState, useEffect } from "react";
import "./placeholder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentPop from "../../components/paymentpop/paymentpop.jsx";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    providence: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [selectedMethod, setSelectedMethod] = useState("esewa");

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2;
      const totalAmount = getTotalCartAmount() + deliveryFee;

      const orderPayload = {
        items: cartItems,
        amount: totalAmount,
        address: `${data.street}, ${data.city}, ${data.providence}, ${data.postalCode}, ${data.country}`,
        phone: data.phone,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      };

      const orderRes = await axios.post(
        "http://localhost:4000/api/order/place",
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderRes.data.success) {
        alert("Order placement failed: " + orderRes.data.message);
        return;
      }

      const orderId = orderRes.data.orderId;

      const paymentPayload = {
        amount: totalAmount,
        productName: "Food Order",
        transactionId: orderId,
        method: selectedMethod,
      };

      const paymentRes = await axios.post(
        "http://localhost:4000/api/initiate-payment",
        paymentPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (selectedMethod === "esewa") {
        const payload = paymentRes.data.payload;

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.entries(payload).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else if (selectedMethod === "khalti") {
        const khaltiPaymentUrl = paymentRes.data.khaltiPaymentUrl;
        window.location.href = khaltiPaymentUrl;
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Failed to process payment.");
    }
  };

  return (
    <form onSubmit={handlePlaceOrder} className="place-order">
      {/* Left Side: Delivery Info */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
            required
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="providence"
            onChange={onChangeHandler}
            value={data.providence}
            type="text"
            placeholder="Providence"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="postalCode"
            onChange={onChangeHandler}
            value={data.postalCode}
            type="text"
            placeholder="Postal code"
            required
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
          required
        />
      </div>

      {/* Right Side: Cart & Payment */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          {/* Payment Method */}
          <PaymentPop
            selectedMethod={selectedMethod}
            onChange={handlePaymentMethodChange}
          />

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
