const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the CartHasProduct schema
const cartHasProductsSchema = new Schema({
  shoppingCartId: {
    type: Schema.Types.ObjectId,
    ref: 'ShoppingCart',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

// Create the CartHasProduct model
const CartHasProducts = db.model('CartHasProducts', cartHasProductsSchema);

module.exports = CartHasProducts;
