import React from "react";
import "./paymentPop.css";  // import the CSS file

const PaymentPop = ({ selectedMethod, onChange }) => {
  return (
    <div className="payment-pop-container">
      <h2 className="payment-pop-title">Select Payment Method</h2>

      <div className="payment-options">
        <label className="payment-label">
          <input
            type="radio"
            name="paymentMethod"
            value="esewa"
            checked={selectedMethod === "esewa"}
            onChange={(e) => onChange(e.target.value)}
            className="payment-radio esewa-radio"
          />
          <span className="payment-span esewa-span">eSewa</span>
        </label>

        <label className="payment-label">
          <input
            type="radio"
            name="paymentMethod"
            value="khalti"
            checked={selectedMethod === "khalti"}
            onChange={(e) => onChange(e.target.value)}
            className="payment-radio khalti-radio"
          />
          <span className="payment-span khalti-span">Khalti</span>
        </label>
      </div>
    </div>
  );
};

export default PaymentPop;
