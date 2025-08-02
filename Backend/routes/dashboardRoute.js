const express = require("express")
const orderModel = require("../models/orderModel")
const userModel = require("../models/userModel")
const foodModel = require("../models/foodModel")

const dashboardRouter = express.Router()

// Get dashboard statistics
dashboardRouter.get("/stats", async (req, res) => {
  try {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Total statistics
    const totalOrders = await orderModel.countDocuments()
    const totalUsers = await userModel.countDocuments()
    const totalProducts = await foodModel.countDocuments()

    // Revenue calculations
    const totalRevenue = await orderModel.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ])

    const todayRevenue = await orderModel.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: startOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ])

    // Order statistics by status
    const ordersByStatus = await orderModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])

    // Popular products
    const popularProducts = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.foodId",
          name: { $first: "$items.name" },
          count: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    // Recent orders
    const recentOrders = await orderModel.find().populate("userId", "name email").sort({ createdAt: -1 }).limit(10)

    // Monthly revenue trend
    const monthlyRevenue = await orderModel.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$finalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        ordersByStatus,
        popularProducts,
        recentOrders,
        monthlyRevenue,
      },
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error fetching dashboard data" })
  }
})

// Get user analytics
dashboardRouter.get("/user-analytics", async (req, res) => {
  try {
    const userStats = await userModel.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
          avgOrdersPerUser: { $avg: "$totalOrders" },
          avgSpentPerUser: { $avg: "$totalSpent" },
        },
      },
    ])

    const newUsersThisMonth = await userModel.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    })

    res.json({
      success: true,
      data: {
        ...userStats[0],
        newUsersThisMonth,
      },
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error fetching user analytics" })
  }
})

module.exports = dashboardRouter
