const express = require('express')

const UserController = require('./Controller/UserController')
const ProductController = require('./Controller/ProductController')
const OrdersController = require('./Controller/OrdersController')
const ShippingController = require('./Controller/ShippingController')
const Middlewares = require('./Middlewares')

const UserRoutes = express.Router()
const ProductRoutes = express.Router()
const OrderRoutes = express.Router()

UserRoutes
    .post('/register', UserController.UserRegistration)
    .post('/login', UserController.UserLogin)
    .get('/profile', UserController.GetUser)
    .put('/profile', UserController.UpdateUser)

ProductRoutes
    .get('/category', ProductController.GetCategory)
    .get('/:productId', ProductController.GetProduct)
    .put('/:productId', ProductController.UpdateProduct)
    .delete('/:productId', ProductController.DeleteProduct)
    .post('/upload', Middlewares.Upload.fields([
        { name: 'product_image', maxCount: 10 }, // Up to 10 image files
        { name: 'product_catalogue', maxCount: 1 },     // Only one PDF file
    ]), ProductController.UploadProduct)

OrderRoutes
    .post('/order', OrdersController.CreateOrder)
    .get('/order_ids', OrdersController.GetOrderList)
    .get('/:orderId', OrdersController.GetOrder)
    .put('/:orderId/status', OrdersController.UpdateOrderStatus)
    .put('/:orderId/cancel', OrdersController.CancelOrder)
    .post('/:orderId/shipping_details', ShippingController.CreateShippingAddress)
    .get('/:orderId/shipping_details', ShippingController.GetShippingDetails)
    .put('/:orderId/update_address', ShippingController.UpdateShippingAddress)

module.exports = { UserRoutes, ProductRoutes, OrderRoutes }