const jwt = require('jsonwebtoken')

const UserAccountDB = require('../Models/UserAccountModel.js')
const ProductDB = require('../Models/ProductsModel.js');

// POST http://localhost:3000/products/upload
exports.UploadProduct = async (req, res) => {
    try {
        const { token } = req.headers;
        const { product_name, about, quantity, price, category_type } = req.body;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (UserData.AccountType === "buyer") {
            return res.status(400).json({
                success: false,
                content: "operation not allowed by buyer"
            });
        }

        const Product = await ProductDB.create({
            SellerId: UserData.SellerId,
            ProductName: product_name,
            CategoryType: category_type,
            About: about,
            Quantity: quantity,
            Price: price,
            ProductImagesDetails: JSON.stringify(req.files['product_image']),
            CataloguePdfDetails: JSON.stringify(req.files['product_catalogue'])
        });

        return res.status(200).json({
            success: true,
            product_id: Product._id
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// PUT http://localhost:3000/products/:productId
exports.UpdateProduct = async (req, res) => {
    try {
        const { token } = req.headers;
        const { product_name, about, quantity, price, category_type } = req.body;
        const { productId } = req.params;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (UserData.AccountType === "buyer") {
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
            product.ProductName = product_name;
        }
        if (about) {
            product.About = about;
        }
        if (quantity) {
            product.Quantity = quantity;
        }
        if (price) {
            product.Price = price;
        }
        if (category_type) {
            product.CategoryType = category_type;
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

// GET http://localhost:3000/products/:productId
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

        const ProductImagesUrls = JSON.parse(product.ProductImagesDetails).map((ele) => '/' + ele.filename);
        const ProductCatalogueUrl = '/' + JSON.parse(product.CataloguePdfDetails)[0].filename;

        return res.status(200).json({
            success: true,
            product_name: product.ProductName,
            category_type: product.CategoryType,
            about: product.About,
            quantity: product.Quantity,
            price: product.Price,
            product_image_url: ProductImagesUrls,
            product_catalogue_url: ProductCatalogueUrl
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// DELETE http://localhost:3000/products/:productId
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

        if (UserData.AccountType === "buyer" || product.SellerId.toString() !== UserData.SellerId.toString()) {
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

// GET http://localhost:3000/products/category
exports.GetCategory = async (req, res) => {
    try {
        const { token } = req.headers;
        const { category_type } = req.query;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "Invalid token"
            });
        }

        const product = await ProductDB.find({ CategoryType: category_type })

        let Products = [];

        product.forEach((Data) => {
            Products.push({
                product_name: Data.ProductName,
                about: Data.About,
                quantity: Data.Quantity,
                price: Data.Price,
                product_image_url: JSON.parse(Data.ProductImagesDetails).map((ele) => '/' + ele.filename),
                product_catalogue_url: '/' + JSON.parse(Data.CataloguePdfDetails)[0].filename
            });
        });

        return res.status(200).json({
            success: true,
            Products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        })
    }
}