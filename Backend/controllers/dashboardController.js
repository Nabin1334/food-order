import express from 'express';
import orderModel from '../models/orderModel';
import userModel from '../models/userModel';
import foodModel from '../models/foodModel';
// import { getSummary } from '../controllers/dashboardController';
// import { authenticate } from '../middlewares/authMiddleware';


const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/foodModel');

exports.getSummary = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRevenueData = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = totalRevenueData[0]?.total || 0;

        const ordersByDate = await Order.aggregate([
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            totalOrders,
            totalUsers,
            totalRevenue,
            ordersByDate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
