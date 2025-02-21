import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments().where(
        "isDeleted",
        false
    );

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
        totalSales: 0,
        totalRevenue: 0,
    };

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue,
    };
};

export const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%d-%m-%Y",
                            date: "$createdAt",
                        },
                    },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const dateArray = getDatesInRange(startDate, endDate);

        return dateArray.map((date) => {
            const foundData = dailySalesData.find((item) => item._id === date);

            return {
                date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            };
        });
    } catch (error) {
        throw error;
    }
};

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

export const getAnalytics = async (req, res) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $match: { status: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const totalOrders = await Order.countDocuments();

        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const recentOrders = await Order.aggregate([
            {
                $match: {
                    status: "paid",
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { date: "$_id", total: 1, _id: 0 } },
        ]);

        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    total: { $sum: "$items.quantity" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    name: "$product.name",
                    total: 1,
                    _id: 0,
                },
            },
        ]);

        res.json({
            totalRevenue: totalRevenue[0]?.total || 0,
            totalOrders,
            totalUsers,
            totalProducts,
            recentOrders,
            topProducts,
        });
    } catch (error) {
        console.error("Error getting analytics:", error);
        res.status(500).json({ message: error.message });
    }
};
