const express = require("express")
const foodModel = require("../models/foodModel")
const orderModel = require("../models/orderModel")
const userModel = require("../models/userModel")
const authMiddleware = require("../middleware/auth")

const recommendationRouter = express.Router()

// Get personalized recommendations
recommendationRouter.get("/personalized", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId
    const user = await userModel.findById(userId).populate("orderHistory")

    // Get user's order history
    const userOrders = await orderModel.find({ userId }).populate("items.foodId")

    // Extract user preferences
    const orderedCategories = []
    const orderedItems = []

    userOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.foodId) {
          orderedCategories.push(item.foodId.category)
          orderedItems.push(item.foodId._id.toString())
        }
      })
    })

    // Get category preferences
    const categoryCount = {}
    orderedCategories.forEach((cat) => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    const preferredCategories = Object.keys(categoryCount)
      .sort((a, b) => categoryCount[b] - categoryCount[a])
      .slice(0, 3)

    // Get recommendations based on preferences
    let recommendations = []

    if (preferredCategories.length > 0) {
      recommendations = await foodModel
        .find({
          category: { $in: preferredCategories },
          _id: { $nin: orderedItems },
          isAvailable: true,
        })
        .sort({ rating: -1, orderCount: -1 })
        .limit(8)
    }

    // If not enough recommendations, add popular items
    if (recommendations.length < 8) {
      const popularItems = await foodModel
        .find({
          _id: { $nin: [...orderedItems, ...recommendations.map((r) => r._id)] },
          isAvailable: true,
        })
        .sort({ orderCount: -1, rating: -1 })
        .limit(8 - recommendations.length)

      recommendations = [...recommendations, ...popularItems]
    }

    res.json({
      success: true,
      data: {
        recommendations,
        preferredCategories,
        reason: "Based on your order history and preferences",
      },
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error getting recommendations" })
  }
})

// Get similar items
recommendationRouter.get("/similar/:foodId", async (req, res) => {
  try {
    const { foodId } = req.params
    const currentItem = await foodModel.findById(foodId)

    if (!currentItem) {
      return res.json({ success: false, message: "Item not found" })
    }

    // Find similar items based on category and tags
    const similarItems = await foodModel
      .find({
        _id: { $ne: foodId },
        $or: [{ category: currentItem.category }, { tags: { $in: currentItem.tags } }],
        isAvailable: true,
      })
      .sort({ rating: -1 })
      .limit(6)

    res.json({
      success: true,
      data: similarItems,
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error getting similar items" })
  }
})

// Get trending items
recommendationRouter.get("/trending", async (req, res) => {
  try {
    const trendingItems = await foodModel.find({ isAvailable: true }).sort({ orderCount: -1, rating: -1 }).limit(10)

    res.json({
      success: true,
      data: trendingItems,
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error getting trending items" })
  }
})

module.exports = recommendationRouter
