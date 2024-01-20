const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the Seller schema
const sellerSchema = new Schema({
  notificationId: [{
    type: Schema.Types.ObjectId,
    ref: 'notification',
  }],
  companyName: {
    type: String
  },
  bussinessType: {
    type: String
  },
  gstNumber: {
    type: String
  },
  kycIsVerified: {
    type: Boolean,
    default: false
  }
});

// Create the Seller model
const Seller = db.model('Seller', sellerSchema);

module.exports = Seller;
