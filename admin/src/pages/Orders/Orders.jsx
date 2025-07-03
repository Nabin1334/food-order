import React from 'react'
import './Orders.css'  
import axios from "axios";
import { useState } from 'react'
import { toast } from 'react-toastify';
 import { useEffect } from 'react';
 import {assets} from '../../assets/assets.js';

const Orders = ({url}) => {

  const [Orders,setOrders]=useState([]);
  const fetvchAllOrders = async () => {
    const response = await axios.get(url+"/api/orders/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);

    } else {
      toast.error("Failed to fetch orders");
   
    }

  }
const statusHandler = async (event,orderId) => {
// console.log(event,orderId);
const response = await axios.post(url+"/api/order/status",{
  orderId,
  status: event.target.value
})
if (response.data.success) {
  // console.log(response.data);
  toast.success("Order status updated successfully");
  await fetvchAllOrders();
  }
}

  useEffect(() => {
    fetvchAllOrders();
  },[])
  return (
    <div className='order add'>
      <h3>Order page</h3>
    <div className='order-list'>
      {Orders.map((order,index) =>( 
        <div key={index} className='order-item'>
          <img src={assets.parcel_icon} alt="" />
          <div>
            <p className='order-item-food'> {order.items.map((item,index)=>{
              if(index=== order.items.length-1){
                return item.name + " x " + item.quantity;
              }
              else{
                return item.name + " x " + item.quantity + ", ";
              }

            })}</p>
            <p className="order-item-name">{order.address.firstName+" "+ order.address.lastName}</p>
            <div className="order-item-address">
              <p>{order.address.street+","}</p>
              <p>{order.address.city + "," + order.address.province+
              ","+order.address.country+
              ","+order.address.postcode}</p>
            </div>
            <p className = "order-item-phone">{order.address.phone}   </p>
          </div>
          <p>Items : {order.items.length}</p>
          <p>${order.amount}</p>
          <select onChange={(event) => statusHandler(event,order._id)} value={order.status}>
            <option value="Food processing">Food processing</option>
            <option value="Out for delivery"> Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
           </div>
      ))}
    </div>
    </div>
  )
}

export default Orders
