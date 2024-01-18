const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the OrderPlaced schema
const orderPlacedSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: { 
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
});

// Create the OrderPlaced model
const OrderPlaced = db.model('OrderPlaced', orderPlacedSchema);

module.exports = OrderPlaced;
 