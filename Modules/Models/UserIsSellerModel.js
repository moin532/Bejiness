const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the UserHasCart schema
const userIsSeller = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  }
});

// Create the UserHasCart model
const UserIsSeller = db.model('UserIsSeller', userIsSeller);

module.exports = UserIsSeller;
