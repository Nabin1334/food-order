import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

export const getSummary = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        const totalUsers = await userModel.countDocuments();

        const totalRevenueData = await orderModel.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = totalRevenueData[0]?.total || 0;

        const ordersByDate = await orderModel.aggregate([
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
