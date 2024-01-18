const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the Payment schema
const paymentSchema = new Schema({
  paymentMethod: {
    type: String,
    required: true
    // You might want to use an enum to restrict possible values (e.g., ['Credit Card', 'PayPal', 'Cash'])
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentTotalAmount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    default: null
    // This could be the online payment transaction ID or null if it's not an online payment
  }
});

// Create the Payment model
const Payment = db.model('Payment', paymentSchema);

module.exports = Payment;
