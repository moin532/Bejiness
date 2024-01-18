const jwt = require('jsonwebtoken')

const OrderDB = require('../Models/OrderModel.js')
const OrderUserR = require('../Models/OrderPlacedModel.js')

// user based operations

// POST http://localhost:3000/api/orders/place-order
exports.CreateOrder = async (req, res) => {
    try {
        const { token } = req.headers;
        const { ordered_items, total_cost, state, city, postal_code, ship_address } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const Order = await OrderDB.create({
            orderedItems: ordered_items,
            totalCost: total_cost,
            state: state,
            city: city,
            postalCode: postal_code,
            shipAddress: ship_address
        });

        await OrderUserR.create({
            userId: DecodedToken.UserId,
            orderId: Order._id
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

// GET http://localhost:3000/api/orders/:orderId
exports.OrderDetails = async (req, res) => {
    try {
        const { token } = req.headers;

        const { orderId } = req.params;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const Order = await OrderDB.findById(orderId);


        return res.status(200).json({
            success: true,
            order_id: Order._id,
            ordered_items: Order.orderedItems,
            total_cost: Order.totalCost,
            order_date: Order.orderDate,
            delivery_date: Order.deliveryDate,
            state: Order.state,
            city: Order.city,
            postal_code: Order.postalCode,
            ship_address: Order.shipAddress,
            isconfirmed: Order.isConfirmed,
            delivery_status: Order.deliveryStatus
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/api/orders/orders-list
exports.OrderList = async (req, res) => {
    try {
        const { token } = req.headers;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const OrderList = await OrderUserR.find({ userId: DecodedToken.UserId });

        return res.status(200).json({
            success: true,
            Orders: OrderList
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// seller based operations

// PUT http://localhost:3000/api/orders/:orderId
exports.UpdateOrder = async (req, res) => {
    try {
        const { token } = req.headers;

        const { orderId } = req.params;

        const { delivery_date, isconfirmed, delivery_status } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const Order = await OrderDB.findById(orderId);

        if(delivery_date){
            Order.deliveryDate = delivery_date;
        }

        if(isconfirmed){
            Order.isConfirmed = isconfirmed;
        }

        if(delivery_status){
            Order.deliveryStatus = delivery_status;
        }

        Order.save()

        return res.status(200).json({
            success: true,
            content: "updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}