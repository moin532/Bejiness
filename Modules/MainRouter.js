const express = require('express')

const UsersController = require('./Controllers/UsersController')
const ProductsController = require('./Controllers/ProductsController')
const OrdersController = require('./Controllers/OrdersController')
const PaymentController = require('./Controllers/PaymentController')
const CartController = require('./Controllers/CartController')

// const Middlewares = require('./Middlewares')

const UserRoutes = express.Router()
const ProductRoutes = express.Router()
const OrderRoutes = express.Router()
const PaymentRoutes = express.Router()

UserRoutes
    .post('/register', UsersController.UserRegistration)
    .post('/login', UsersController.UserLogin)
    .get('/profile', UsersController.GetUser)
    .put('/profile', UsersController.UpdateUser)
    .delete('/profile', UsersController.DeleteUser)
    .post('/cart/add-item', CartController.AddItem)
    .get('/cart/get-cart', CartController.GetCart)
    .delete('/cart/delete-item', CartController.DeleteItem)
    .put('/cart/update-quantity', CartController.UpdateQuantity)
    .delete('/cart/clear-cart', CartController.ClearCart)

ProductRoutes
    .get('/seller', ProductsController.GetSellerProducts)
    .post('/category', ProductsController.GetCategory)
    .post('/upload', ProductsController.UploadProduct)
    .get('/:productId', ProductsController.GetProduct)
    .put('/:productId', ProductsController.UpdateProduct)
    .delete('/:productId', ProductsController.DeleteProduct)

OrderRoutes
    .post('/place-order', OrdersController.CreateOrder)
    .get('/:orderId', OrdersController.OrderDetails)
    .get('/orders-list', OrdersController.OrderList)
    .put('/:orderId', OrdersController.UpdateOrder)

PaymentRoutes
    .post('/process-payment', PaymentController.ProcessPayment)
    // .post('/place-order', PaymentController.OrderPayment)
    // .post('/order/validate', PaymentController.ValidateOrder)

module.exports = { UserRoutes, ProductRoutes, OrderRoutes, PaymentRoutes }
