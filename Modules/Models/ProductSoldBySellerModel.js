const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the ProductSoldBySeller schema
const productSoldBySellerSchema = new Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

// Create the ProductSoldBySeller model
const ProductSoldBySeller = db.model('ProductSoldBySeller', productSoldBySellerSchema);

module.exports = ProductSoldBySeller;
