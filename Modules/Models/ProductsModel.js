const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector');

const Schema = mongoose.Schema;

// Define the Product schema
const productsSchema = new Schema({
  SellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
  },
  CategoryType: {
    type: String,
    required: true,
    enum: [
      'agri products & equipments',
      'apparel and fashion',
      'architects & interior designing',
      'automobile parts & spares',
      'chemicals,dyes & solvents',
      'construction & real estate',
      'consumer electronics',
      'electricals & electronics',
      'energy and power'
    ]
  },
  ProductName: {
    type: String,
    required: true,
  },
  ProductImagesDetails: {
    type: Object,
    required: true,
  },
  About: {
    type: String,
    required: true,
  },
  CataloguePdfDetails: {
    type: Object,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
});

// Create the Product model
const Products = db.model('Products', productsSchema);

module.exports = Products;
