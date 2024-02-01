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
        if(Product.prices[0].quantityRange.min){
            quantity = Product.prices[0].quantityRange.min;
        }else{
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

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        const UserCart = await ShoppingCart.findById(UserData.shoppingCartId);

        let CartItems = [];

        const fetchCartItemDetails = async (item) => {
            try {
                const product = await ProductDB.findById(item.productId);
                const sellerData = await SellerDB.findById(product.sellerId);

                const ProductImagesUrls = JSON.parse(product.images).map((ele) => '/' + ele.filename);

                const cartDetails = {
                    product_name: product.productName,
                    prices: product.prices,
                    seller: sellerData.companyName,
                    product_category: product.categoryType,
                    product_id: product._id,
                    product_image: ProductImagesUrls,
                    quantity: item.quantity
                };

                return cartDetails;
            } catch (error) {
                console.error('Error fetching cart item details:', error);
                throw error; // Propagate the error to handle it in Promise.all
            }
        };

        const cartItemDetailsArray = await Promise.all(UserCart.productDetails.map(fetchCartItemDetails));
        CartItems = [...cartItemDetailsArray];

        let totalAmount = 0;

        for (const cartItem of UserCart.productDetails) {
          const currProduct = await ProductDB.findById(cartItem.productId);
          const quantity = cartItem.quantity;
        
          let applicablePrice = 0;
        
          for (const price of currProduct.prices) {
            console.log(price);
            if (
              (!price.quantityRange.min || quantity >= price.quantityRange.min) &&
              (!price.quantityRange.max || quantity <= price.quantityRange.max)
            ) {
              applicablePrice = price.price;
              break;
            }
          }
        
          console.log(totalAmount);
          totalAmount += applicablePrice * quantity;
        }
        console.log("final: ",totalAmount);

        return res.status(200).json({
          success: true,
          cart_items: {
            product_details: CartItems,
            status: UserCart.status,
            total_amount: totalAmount,
          },
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
