const mongoose = require('mongoose');

const uri = "mongodb+srv://sumithraj:A7Jeh9LKKUa6XXVg@clonecluster.xebguct.mongodb.net/B2B?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

module.exports = mongoose.connection;
