const Blogs = require('../Models/BlogsModel');

// GET http://localhost:3000/api/v1/blogs
exports.getBlogs = async (req, res) => {
  try {
    const Allblogs = await Blogs.find()

    if (!Allblogs) {
      return res.status(404).json({
        blogs: "blogs not found",
      });
    }

    res.status(200).json({
      success: true,
      Allblogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      content: error.message,
    });
  }
};

exports.getSingleBlog = async(req,res)=>{
  try {

    
    const SingleBlog = await Blogs.findById(req.params.id);

    if (!SingleBlog) {
      return res.status(404).json({
        blogs: "blog not found",
      });
    }
  
    
    res.status(200).json({
      success: true,
      SingleBlog
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      content: error.message,
    });
  }

}