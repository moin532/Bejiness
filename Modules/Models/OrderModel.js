const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the Order schema
const orderSchema = new Schema({
  orderedItems: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  totalCost: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  postalCode: {
    type: String
  },
  shipAddress: {
    type: String
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  deliveryStatus: {
    type: String,
    default: 'Pending'
    // Possible values: 'Pending', 'Shipped', 'Delivered', etc.
  }
});

// Create the Order model
const Order = db.model('Order', orderSchema);

module.exports = Order;
