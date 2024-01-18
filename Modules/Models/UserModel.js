const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    default: 'buyer'
  },
  address: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  shoppingCartId: {
    type: Schema.Types.ObjectId,
    ref: 'ShoppingCart'
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    default: null
  }
});

// Create the User model
const User = db.model('User', userSchema);

module.exports = User;
