const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the OrderHasProducts schema
const orderHasProductsSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  productDetails: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }]
});

// Create the OrderHasProducts model
const OrderHasProducts = db.model('OrderHasProducts', orderHasProductsSchema);

module.exports = OrderHasProducts;
