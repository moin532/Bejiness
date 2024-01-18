const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the UserHasCart schema
const userHasCartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shoppingCartId: {
    type: Schema.Types.ObjectId,
    ref: 'ShoppingCart',
    required: true
  }
});

// Create the UserHasCart model
const UserHasCart = db.model('UserHasCart', userHasCartSchema);

module.exports = UserHasCart;
