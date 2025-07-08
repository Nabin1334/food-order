import React from 'react';
import PaymentFailed from './PaymentFailed';
import PaymentSuccess from './PaymentSuccess';
import PlaceOrder from './PlaceOrder';

const PaymentFailed = () => {
  return (
    <div>
      <h1>❌ Payment Failed</h1>
      <p>Please try again.</p>
    </div>
  );
};

export default PaymentFailed;
