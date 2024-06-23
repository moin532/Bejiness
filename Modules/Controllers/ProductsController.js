const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary');
const UserAccountDB = require('../Models/UserModel.js')
const ProductDB = require('../Models/ProductModel.js')
const SellerDB = require('../Models/SellerModel.js')


// const filePath = 'C:\\Users\\moinMK123\\Desktop\\Bejiness-main\\d';
// console.log(`Attempting to open file at path: ${filePath}`);

// fs.open(filePath, 'r', (err, fd) => {
//   if (err) {
//     if (err.code === 'ENOENT') {
//       console.error('File not found:', filePath);
//     } else {
//       console.error('An error occurred:', err);
//     }
//     return;
//   }
//   console.log('File opened successfully:', filePath);
//   // Continue with file operations
// });
// const cloudinary = require('cloudinary').v2

// Configure Cloudinary
// cloudinary.config({
//     cloud_name: 'b2b',
//     api_key: '464323567428642',
//     api_secret: 'fgv0eBXcgf8GsKcXhteLgeHPtMY'
// });

// POST http://localhost:3000/api/products/upload
exports.UploadProduct = async (req, res) => {
    try {

        console.log(req.body);


        const { token } = req.headers;
        const { product_name, description, prices, specs, category_type } = req.body;


        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (UserData.accountType === "buyer") {
            return res.status(400).json({
                success: false,
                content: "operation not allowed by buyer"
            });
        }

        let images = [];

        if (typeof req.body.product_image === "string") {
            images.push(req.body.product_image);

        } else {
            images = req.body.product_image
        }

        let imagesLinksPublicId = [];
        let imagesLinksUrl = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products"
            })

            imagesLinksPublicId.push(result.public_id)
            imagesLinksUrl.push(result.secure_url);
        }

        const Product = await ProductDB.create({
            sellerId: UserData.sellerId,
            productName: product_name,
            categoryType: category_type,
            description: description,
            prices: JSON.parse(prices),
            specs: JSON.parse(specs),
            images: [imagesLinksUrl]
        });

        return res.status(200).json({
            success: true,
            product_id: Product._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/api/products/:productId
exports.GetProduct = async (req, res) => {
    try {
        const { token } = req.headers;
        const { productId } = req.params;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (!UserData) {
            return res.status(400).json({
                success: false,
                content: "User not found"
            });
        }

        const product = await ProductDB.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                content: "Product not found"
            });
        }


        // const ProductImagesUrls = JSON.parse(product.images).map((ele) => '/' + ele.filename);

        return res.status(200).json({
            success: true,
            product_name: product.productName,
            category_type: product.categoryType,
            description: product.description,
            prices: product.prices,
            onsale: product.onSale,
            specs: product.specs,
            images: product.images,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/api/products/seller
exports.GetSellerProducts = async (req, res) => {
    try {
        const { token } = req.headers;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (!UserData) {
            return res.status(400).json({
                success: false,
                content: "User not found"
            });
        }

        if (UserData.accountType != "seller") {
            return res.status(400).json({
                success: false,
                content: "operation not allowed by other user"
            })
        }

        const Products = await ProductDB.find({ sellerId: UserData.sellerId })

        const resultProducts = []

        Products.forEach((Data) => {
            resultProducts.push({
                product_id: Data._id,
                product_name: Data.productName,
                category_type: Data.categoryType,
                description: Data.description,
                prices: Data.prices,
                images: Data.images[0].url
            });
        })

        return res.status(200).json({
            success: true,
            products: resultProducts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// PUT http://localhost:3000/api/products/:productId
exports.UpdateProduct = async (req, res) => {
    try {
        const { token } = req.headers;
        const { product_name, description, prices, category_type, onsale, specs } = req.body;
        const { productId } = req.params;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (UserData.accountType === "buyer") {
            return res.status(400).json({
                success: false,
                content: "Operation not allowed by a buyer"
            });
        }

        const product = await ProductDB.findById(productId);

        if (!product) {
            return res.status(400).json({
                success: false,
                content: "Product not found"
            });
        }

        if (product_name) {
            product.productName = product_name;
        }
        if (description) {
            product.description = description;
        }
        if (onsale) {
            product.onSale = onsale;
        }
        if (prices) {
            product.prices = prices;
        }
        if (category_type) {
            product.categoryType = category_type;
        }
        if (specs) {
            product.specs = specs;
        }

        // files update remaining,will do it later

        await product.save();

        return res.status(200).json({
            success: true,
            content: "Product updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// DELETE http://localhost:3000/api/products/:productId
exports.DeleteProduct = async (req, res) => {
    try {
        const { token } = req.headers;
        const { productId } = req.params;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (!UserData) {
            return res.status(400).json({
                success: false,
                content: "User not found"
            });
        }

        const product = await ProductDB.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                content: "Product not found"
            });
        }

        if (UserData.accountType === "buyer" || product.sellerId.toString() !== UserData.sellerId.toString()) {
            return res.status(403).json({
                success: false,
                content: "Unauthorized to delete this product"
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            content: "Product deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// POST http://localhost:3000/api/products/category
exports.GetCategory = async (req, res) => {
    try {
        const { token } = req.headers;
        const { category_type } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        let Products;

        if (category_type !== "all") {
            Products = await ProductDB.find({ categoryType: category_type });
        } else {
            Products = await ProductDB.find();
        }

        const resultProducts = [];

        for (const Data of Products) {
            const Seller = await SellerDB.findById(Data.sellerId);

            resultProducts.push({
                product_id: Data._id,
                product_name: Data.productName,
                category_type: Data.categoryType,
                description: Data.description,
                prices: Data.prices,
                images: Data.images[0].url,
                seller: {
                    seller_company: Seller.companyName,
                    seller_type: Seller.bussinessType,
                    is_seller_verified: Seller.kycIsVerified,
                }
            });
        }

        return res.status(200).json({
            success: true,
            products: resultProducts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
};


// GET http://localhost:3000/api/products/search?q=product_search
exports.SearchProducts = async (req, res) => {
    try {
        const searchQuery = req.query.q;

        const regex = new RegExp(searchQuery, 'i'); 
    
        const products = await ProductDB.find({
          $or: [
            { name: regex },
            { description: regex }
          ]
        });
        
        const resultProducts = []

        for (const Data of products) {
            const Seller = await SellerDB.findById(Data.sellerId);

            resultProducts.push({
                product_id: Data._id,
                product_name: Data.productName,
                category_type: Data.categoryType,
                description: Data.description,
                prices: Data.prices,
                images: Data.images[0].url,
                seller: {
                    seller_company: Seller.companyName,
                    seller_type: Seller.bussinessType,
                    is_seller_verified: Seller.kycIsVerified,
                }
            });
        }

        return res.status(200).json({
            success: true,
            products: resultProducts
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            content: error.message
        })
    }
}