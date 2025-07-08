import React, { useContext ,useState } from 'react'
import "./placeholder.css" // Importing the CSS file for styling
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import paymentSuccess from '../PaymentSuccess/PaymentSuccess.jsx';
import paymentFailed from '../PaymentFailed/PaymentFailed.jsx';
// This component will serve as the home page for the application
const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);
  const [esewaData, setEsewaData] =useState(null);
   const userId = "USER123"; // Replace with real user ID
  const amount = getTotalCartAmount();


const [data, setData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    providence: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({ ...data, [name]: value });

  }

  const PlaceOrder = async (event) => {
    alert("Error");

  }

  const nevigate = useNavigate();

  useEffect(() => {
if (!token) {
  nevigate("/cart");
}
else if (getTotalCartAmount() === 0) {
  nevigate("/cart");
}
  },[token])
  
    const handlePlaceOrder = async () => {
    const orderPayload = {   
      items: cartItems,
      amount,
      address: "Bharatpur", // Replace with user input
      userId,
    };

    try {
      const res = await axios.post("http://localhost:4000/api/order/place", orderPayload);
      const { esewaURL, payload } = res.data;

      setEsewaData({ esewaURL, payload });
    } catch (error) {
      console.log("Order placing failed", error);
    }
  };

  
  // Function to calculate the total amount in the cart
  return (
    <form onSubmit={PlaceOrder}className='place-order'>
      <div className="place-order-left">
        

          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
            <input name='lastName' onChange={onChangeHandler} value={data.lastName}  type="text" placeholder='Last name' />
          </div>
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
          <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />

          <div className="multi-fields">
            <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
            <input name='providence' onChange={onChangeHandler} value={data.providence} type="text" placeholder='Providence' />
          </div>
          <div className="multi-fields">
            <input name='postalCode' onChange={onChangeHandler} value={data.postalCode} type="text" placeholder='Postal code' />
            <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />

        </div>
        <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone ' />

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
              <p>₹{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div>
          </div>
           <button type="submit">PROCEED TO PAYMENT</button>
        </div>

      </div>
      
    </form>
  )
}

export default PlaceOrder
