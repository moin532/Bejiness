const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the Product schema
const productSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  prices: [{
    price: {
      type: Number,
      required: true
    },
    quantityRange: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      }
    }
  }],
  onSale: {
    type: Boolean,
    default: true
  },
  specs: [{
    key:{
      type:String
    },
    value:{
      type:String
    }
  }],
  categoryType: {
    type: String
  },
  images: [{
    type: String // the image is stored as a URL
  }],
  catalogue: {
    type: String // the catalogue is stored as a URL
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    default: null
  }
});

// Create the Product model
const Product = db.model('Product', productSchema);

module.exports = Product;
 
