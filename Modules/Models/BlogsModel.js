const mongoose = require('mongoose');
const db = require('./MainDatabaseConnector')


// const SubpointSchema = new mongoose.Schema({
//     text: {
//       type: String,
//     }
//   });
  
  const PointSchema = new mongoose.Schema({
    _id: false, 
    point: {
      type: String,
    },
    subpoints: [String]
  });

  
const BlogsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },

    points: [PointSchema],

    images:[],

    date: {
        type: Date,
        default: Date.now
    }
}) 

const Blog = db.model('Blogs', BlogsSchema);

module.exports = Blog