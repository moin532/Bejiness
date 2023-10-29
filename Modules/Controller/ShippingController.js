const jwt = require('jsonwebtoken')

const UserAccountDB = require('../Models/UserAccountModel')
const OrderDB = require('../Models/OrderModel')
const ShippingDB = require('../Models/ShippingModel')

// POST http://localhost:3000/orders/:orderId/shipping_details
exports.CreateShippingAddress = async (req, res) => {
    try {
        const { token } = req.headers;
        const order_id = req.params.orderId;
        const { country, state, city, postal_code, street_address } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (!UserData) {
            return res.status(400).json({
                success: false,
                content: "User data not found"
            });
        }

        const ShippingData = await ShippingDB.create({
            BuyerId: UserData.BuyerId,
            OrderId: order_id,
            Country: country,
            State: state,
            City: city,
            PostalCode: postal_code,
            StreetAddress: street_address
        });

        await OrderDB.findOneAndUpdate({ _id: order_id }, { ShippingId: ShippingData._id });

        return res.status(200).json({
            success: true,
            content: "Shipping details created for order",
            order_id: order_id
        })

    } catch (error) {
        return res.status(500).json({
            success: 500,
            content: error.message
        });
    }
}

// GET http://localhost:3000/orders/:orderId/shipping_details
exports.GetShippingDetails = async (req, res) => {
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

        const ShippingData = await ShippingDB.findById(Order.ShippingId);

        if (!ShippingData) {
            return res.status(400).json({
                success: false,
                content: "Shipping details are not available"
            });
        }

        return res.status(200).json({
            success: true,
            content: "Featched shipping data",
            country: ShippingData.Country,
            state: ShippingData.State,
            city: ShippingData.City,
            postal_code: ShippingData.PostalCode,
            street_address: ShippingData.StreetAddress
        });

    } catch (error) {
        return res.status(500).json({
            success: 500,
            content: error.message
        });
    }
}

// PUT http://localhost:3000/orders/:orderId/update_address
exports.UpdateShippingAddress = async (req, res) => {
    try {
        const { token } = req.headers;
        const orderId = req.params.orderId;
        const { country, state, city, postal_code, street_address } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const Order = await OrderDB.findById(orderId);

        const existingAddress = await ShippingDB.findById(Order.ShippingId);
        if (!existingAddress) {
            return res.status(400).json({
                success: false,
                content: "Address not found"
            });
        }

        existingAddress.Country = country || existingAddress.Country;
        existingAddress.State = state || existingAddress.State;
        existingAddress.City = city || existingAddress.City;
        existingAddress.PostalCode = postal_code || existingAddress.PostalCode;
        existingAddress.StreetAddress = street_address || existingAddress.StreetAddress;

        const updatedAddress = await existingAddress.save();

        return res.status(200).json({
            success: true,
            content: "Address updated successfully",
            address: updatedAddress
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
};
