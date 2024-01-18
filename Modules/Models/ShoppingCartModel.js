const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the ShoppingCart schema
const shoppingCartSchema = new Schema({
  productDetails: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    default: 'Active'
    // Possible values: 'Active', 'Inactive', 'Completed', etc.
  }
});

// Create the ShoppingCart model
const ShoppingCart = db.model('ShoppingCart', shoppingCartSchema);

module.exports = ShoppingCart;
