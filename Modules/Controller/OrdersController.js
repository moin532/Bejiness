const jwt = require('jsonwebtoken')

const OrderDB = require('../Models/OrderModel')
const OrderDetailsDB = require('../Models/OrderDetailsModel')
const UserAccountDB = require('../Models/UserAccountModel.js');
const ProductDB = require('../Models/ProductsModel.js')
const BuyerDB = require('../Models/BuyerModel');

// POST http://localhost:3000/orders/order
exports.CreateOrder = async (req, res) => {
    try {
        const { token } = req.headers;
        const { total_amount, product_id, quantity } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (UserData.AccountType === 'seller') {
            return res.status(400).json({
                success: false,
                content: "operation not allowed by seller"
            });
        }

        const Product = await ProductDB.findById(product_id);

        if ((Product.Quantity) < quantity) {
            return res.status(400).json({
                success: false,
                content: "not enough quantity"
            });
        }

        Product.Quantity = Product.Quantity - quantity;
        Product.save();

        const OrderDetails = await OrderDetailsDB.create({
            ProductId: product_id,
            Quantity: quantity,
            UnitPrice: Product.Price
        });

        const Order = await OrderDB.create({
            OrderDetailsId: OrderDetails._id,
            BuyerId: UserData.BuyerId,
            SellerId: Product.SellerId,
            OrderDate: Date.now(),
            TotalAmount: total_amount,
        });

        await BuyerDB.findByIdAndUpdate(UserData.BuyerId, {
            $push: { OrderId: Order._id }
        });

        return res.status(200).json({
            success: true,
            order_id: Order._id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/orders/:orderId
exports.GetOrder = async (req, res) => {
    try {
        const { token } = req.headers;
        const order_id = req.params.orderId;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const Order = await OrderDB.findById(order_id);
        const OrderDetails = await OrderDetailsDB.findById(Order.OrderDetailsId);

        return res.status(200).json({
            success: true,
            order_date: Order.OrderDate,
            total_amount: Order.TotalAmount,
            status: Order.Status,
            quantity: OrderDetails.Quantity,
            product_id: OrderDetails.ProductId
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/orders/order_ids
exports.GetOrderList = async (req, res) => {
    try {
        const { token } = req.headers;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (UserData.AccountType === 'seller') {
            return res.status(400).json({
                success: false,
                content: "operation not allowed by Seller."
            });
        }

        const BuyerData = await BuyerDB.findById(UserData.BuyerId);

        return res.status(200).json({
            success: true,
            orders_id: BuyerData.OrderId
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// PUT http://localhost:3000/orders/:orderId/status
exports.UpdateOrderStatus = async (req, res) => {
    try {
        const { token } = req.headers;
        const orderId = req.params.orderId;
        const { new_status } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const order = await OrderDB.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                content: "Order not found"
            });
        }

        const validStatuses = ['pending', 'shipped', 'delivered'];
        if (!validStatuses.includes(new_status)) {
            return res.status(400).json({
                success: false,
                content: "Invalid status"
            });
        }

        order.Status = new_status;
        await order.save();

        return res.status(200).json({
            success: true,
            content: "Order status updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
};

// PUT http://localhost:3000/orders/:orderId/cancel
exports.CancelOrder = async (req, res) => {
    try {
        const { token } = req.headers;
        const orderId = req.params.orderId;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const order = await OrderDB.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                content: "Order not found"
            });
        }

        if (order.Status !== 'shipped' && order.status !== 'delivered') {
            order.Status = 'cancelled';
            await order.save();

            return res.status(200).json({
                success: true,
                content: "Order has been canceled successfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                content: "Order cannot be canceled at this stage"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
};

// GET http://localhost:3000/orders/analytics
// exports.OrderAnalytics = async (req, res) => {
//     try {
//         // Perform various analytics operations
//         // For instance, let's calculate total sales, average order value, and most ordered products

//         // Calculate total sales
//         const totalSales = await OrderDB.aggregate([
//             {
//                 $group: {
//                     _id: null,
//                     totalAmount: { $sum: "$TotalAmount" }
//                 }
//             }
//         ]);

//         // Calculate average order value
//         const averageOrderValue = await OrderDB.aggregate([
//             {
//                 $group: {
//                     _id: null,
//                     avgAmount: { $avg: "$TotalAmount" }
//                 }
//             }
//         ]);

//         // Find most ordered products
//         const mostOrderedProducts = await OrderDetailsDB.aggregate([
//             {
//                 $group: {
//                     _id: "$ProductId",
//                     totalQuantity: { $sum: "$Quantity" }
//                 }
//             },
//             { $sort: { totalQuantity: -1 } },
//             { $limit: 5 } // Get the top 5 most ordered products
//         ]);

//         return res.status(200).json({
//             success: true,
//             analytics: {
//                 totalSales: totalSales[0]?.totalAmount || 0,
//                 averageOrderValue: averageOrderValue[0]?.avgAmount || 0,
//                 mostOrderedProducts
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             content: error.message
//         });
//     }
// };
