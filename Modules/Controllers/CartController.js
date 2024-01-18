const jwt = require('jsonwebtoken')

const OrderDB = require('../Models/OrderModel')
const OrderUserR = require('../Models/OrderPlacedModel')
const UserAccountDB = require('../Models/UserModel.js')
const ProductDB = require('../Models/ProductModel.js')
const ShoppingCart = require('../Models/ShoppingCartModel.js')

// POST http://localhost:3000/api/users/cart/add-item
exports.AddItem = async (req, res) => {
    try {
        const { token } = req.headers;
        const { product_id, quantity } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        const UserCart = await ShoppingCart.findById(UserData.shoppingCartId);

        UserCart.productDetails = [...UserCart.productDetails, {product_id, quantity}];

        UserCart.save();

        return res.status(200).json({
            success: true,
            content: "cart updated"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/api/users/cart/get-cart
exports.AddItem = async (req, res) => {
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

        const UserCart = await ShoppingCart.findById(UserData.shoppingCartId);

        return res.status(200).json({
            success: true,
            cart_item: {
                product_details: UserCart.productDetails,
                status: UserCart.status
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// DELETE http://localhost:3000/api/users/cart/delete-item
exports.DeleteItem = async (req, res) => {
    try {
        const { token } = req.headers;
        const { product_id } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        const UserCart = await ShoppingCart.findById(UserData.shoppingCartId);

        // Find the index of the product in the cart
        const productIndex = UserCart.productDetails.findIndex(item => item.product_id === product_id);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                content: "Product not found in the cart"
            });
        }

        // Remove the product from the array
        UserCart.productDetails.splice(productIndex, 1);

        UserCart.save();

        return res.status(200).json({
            success: true,
            content: "Item removed from the cart"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// PUT http://localhost:3000/api/users/cart/update-quantity
exports.UpdateQuantity = async (req, res) => {
    try {
        const { token } = req.headers;
        const { product_id, quantity } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        const UserCart = await ShoppingCart.findById(UserData.shoppingCartId);

        // Find the index of the product in the cart
        const productIndex = UserCart.productDetails.findIndex(item => item.product_id === product_id);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                content: "Product not found in the cart"
            });
        }

        // Update the quantity of the product
        UserCart.productDetails[productIndex].quantity = quantity;

        UserCart.save();

        return res.status(200).json({
            success: true,
            content: "Quantity updated in the cart"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// DELETE http://localhost:3000/api/users/cart/clear-cart
exports.ClearCart = async (req, res) => {
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

        const UserCart = await ShoppingCart.findById(UserData.shoppingCartId);

        // Clear the productDetails array
        UserCart.productDetails = [];

        UserCart.save();

        return res.status(200).json({
            success: true,
            content: "Shopping cart cleared"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}
