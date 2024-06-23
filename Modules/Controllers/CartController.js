const jwt = require('jsonwebtoken')

const OrderDB = require('../Models/OrderModel')
const OrderUserR = require('../Models/OrderPlacedModel')
const UserAccountDB = require('../Models/UserModel.js')
const ProductDB = require('../Models/ProductModel.js')
const ShoppingCart = require('../Models/ShoppingCartModel.js')
const SellerDB = require('../Models/SellerModel.js')

// POST http://localhost:3000/api/users/cart/add-item
exports.AddItem = async (req, res) => {
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

        const Product = await ProductDB.findById(product_id);

        let quantity;
        if (Product.prices[0].quantityRange.min) {
            quantity = Product.prices[0].quantityRange.min;
        } else {
            quantity = 1;
        }

        // Check if the product is already in the cart
        const existingProductIndex = UserCart.productDetails.findIndex(item => String(item.productId) === String(product_id));

        if (existingProductIndex !== -1) {
            // Product is already in the cart, increment the quantity
            UserCart.productDetails[existingProductIndex].quantity += quantity;
        } else {
            // Product is not in the cart, add it with the specified quantity
            UserCart.productDetails.push({
                productId: product_id,
                quantity: quantity
            });
        }

        await UserCart.save();

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
exports.GetCart = async (req, res) => {
    try {
        const { token } = req.headers;

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWTKEY);
        if (!decodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        // Fetch user data
        const userData = await UserAccountDB.findById(decodedToken.UserId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                content: "User not found"
            });
        }

        // Fetch user's cart
        const userCart = await ShoppingCart.findById(userData.shoppingCartId);
        if (!userCart) {
            return res.status(404).json({
                success: false,
                content: "Cart not found"
            });
        }

        // Fetch all products concurrently
        const productIds = userCart.productDetails.map(item => item.productId);
        const products = await ProductDB.find({ _id: { $in: productIds } });

        // Create a map for quick access to products
        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        // Fetch all sellers concurrently
        const sellerIds = Array.from(new Set(products.map(product => product.sellerId)));
        const sellers = await SellerDB.find({ _id: { $in: sellerIds } });

        // Create a map for quick access to sellers
        const sellerMap = new Map(sellers.map(seller => [seller._id.toString(), seller]));

        // Generate cart item details
        const cartItems = userCart.productDetails.map(item => {
            const product = productMap.get(item.productId.toString());
            if (!product) return null;

            const seller = sellerMap.get(product.sellerId.toString());
            if (!seller) return null;

            return {
                product_name: product.productName,
                prices: product.prices,
                seller: seller.companyName,
                product_category: product.categoryType,
                product_id: product._id,
                product_image: product.images[0]?.url, // Handle the case where images might be empty
                quantity: item.quantity
            };
        }).filter(item => item !== null); // Filter out any null values

        // Calculate total amount
        let totalAmount = 0;
        userCart.productDetails.forEach(item => {
            const product = productMap.get(item.productId.toString());
            if (!product) return; // Skip if the product is not found

            const quantity = item.quantity;

            // Find the applicable price
            const applicablePrice = product.prices.find(price => 
                (!price.quantityRange.min || quantity >= price.quantityRange.min) &&
                (!price.quantityRange.max || quantity <= price.quantityRange.max)
            )?.price || 0;

            totalAmount += applicablePrice * quantity;
        });

        // Send response
        return res.status(200).json({
            success: true,
            cart_items: {
                product_details: cartItems,
                status: userCart.status,
                total_amount: totalAmount
            }
        });

    } catch (error) {
        console.log(error);
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
        const productIndex = UserCart.productDetails.findIndex(item => String(item.productId) === product_id);

        if (productIndex === -1) {
            return res.status(400).json({
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

        // Check if the product is already in the cart
        const existingProductIndex = UserCart.productDetails.findIndex(item => String(item.productId) === String(product_id));

        if (existingProductIndex !== -1) {
            // Product is already in the cart, update the quantity
            UserCart.productDetails[existingProductIndex].quantity = quantity;
        } else {
            // Product is not in the cart, add it with the specified quantity
            UserCart.productDetails.push({
                productId: product_id,
                quantity: quantity
            });
        }

        await UserCart.save();

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
