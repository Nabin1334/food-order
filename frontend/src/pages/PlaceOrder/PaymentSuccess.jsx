import React from 'react';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';
import PlaceOrder from './PlaceOrder';

const PaymentSuccess = () => {
  return (
    <div>
      <h1>🎉 Payment Successful!</h1>
      <p>Your order has been confirmed.</p>
    </div>
  );
};

export default PaymentSuccess;
