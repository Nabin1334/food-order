import orderModel from '../models/orderModel.js';
import fs from 'fs';
// import mergeSort from '../utils/mergeSort.js';
// import foodModel from '../models/foodModel.js';


//place order 
 const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, userId } = req.body;

    // Validate required fields
    if (!items || !amount || !address || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create new order in DB
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });

    await newOrder.save();

    // Respond with order data
    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};


// Update payment status
const updatePayment = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    order.payment = paymentStatus === "completed";
    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ success: true, message: "Payment status updated successfully" });
  } catch (error) {
    console.log("Error updating payment status:", error);
    res.json({ success: false, message: "Failed to update payment status" });
  }
};

//user orders for frontend

const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//list all orders for admin panel
const listAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log("Error updating order status:", error);
    res.json({ success: false, message: "Failed to update order" });
  }
};

export { placeOrder, updatePayment, userOrder, listAllOrders, updateStatus };
// Function to verify order payment
