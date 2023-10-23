const express = require('express')
const UserController = require('./Controller/UserController')

const UserRoutes = express.Router()

UserRoutes
    .post('/register', UserController.UserRegistration)

module.exports = { UserRoutes }