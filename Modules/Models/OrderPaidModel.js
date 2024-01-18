const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the OrderPaid schema
const orderPaidSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  }
});

// Create the OrderPaid model
const OrderPaid = db.model('OrderPaid', orderPaidSchema);

module.exports = OrderPaid;
