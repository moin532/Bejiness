const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2;

const UserAccountDB = require('../Models/UserModel.js')
const SellerDB = require('../Models/SellerModel.js')
const ShoppingCartDB = require('../Models/ShoppingCartModel.js')
const UserCartR = require('../Models/UserHasCartModel.js')
const UserSellerR = require('../Models/UserIsSellerModel.js')

dotenv.config()

// POST http://localhost:3000/api/users/register
exports.UserRegistration = async (req, res) => {
    // creates user account, 
    // and if seller then seller account additionally,
    // create one cart per user
    try {
	console.log(req.body)
        const { full_name, email, account_type, phone_number, password, address } = req.body;

        const isPresentEmail = await UserAccountDB.findOne({ email: email });
        const isPresentNumber = await UserAccountDB.findOne({ phoneNumber: phone_number });

        if (isPresentEmail || isPresentNumber) {
            return res.status(400).json({
                success: false,
                content: "credintials already exist",
            });
        }

        const Cart = await ShoppingCartDB.create({
            productDetails: [],
            status: "inactive"
        });

        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(password, salt);

        const UserData = await UserAccountDB.create({
            fullName: full_name,
            accountType: account_type.toLowerCase(),
            email: email,
            phoneNumber: phone_number,
            password: hashedPwd,
            address: address,
            shoppingCartId: Cart._id
        });

        await UserCartR.create({
            userId: UserData._id,
            shoppingCartId: Cart._id
        });

        if (account_type.toLowerCase() == "seller") {
            const { company_name, bussiness_type, gst_number } = req.body;
            const SellerData = await SellerDB.create({
                companyName: company_name,
                bussinessType: bussiness_type,
                gstNumber: gst_number,
            });
            await UserAccountDB.findByIdAndUpdate(UserData, {
                sellerId: SellerData._id
            });
            await UserSellerR.create({
                userId: UserData._id,
                sellerId: SellerData._id
            });
        }

        const Token = jwt.sign({
            UserId: UserData._id,
            PhoneNumber: phone_number
        }, process.env.JWTKEY, {
            expiresIn: '183d'
        });

        return res.status(200).json({
            success: true,
            token: Token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// POST http://localhost:3000/api/users/login
exports.UserLogin = async (req, res) => {
    // only verifies user and sends the login token 
    // that is valid for 6 months
    try {
        const { phone_number, password } = req.body;

        const Data = await UserAccountDB.findOne({ phoneNumber: phone_number });

        const isMatch = await bcrypt.compare(password, Data.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                content: "Incorrect Password"
            });
        }

        const Token = jwt.sign({
            UserId: Data._id,
            PhoneNumber: phone_number
        }, process.env.JWTKEY, {
            expiresIn: '5d'
        });

        return res.status(200).json({
            success: true,
            token: Token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/api/users/profile
exports.GetUser = async (req, res) => {
    // send details to display on user profile
    // (seller details additionally if seller)
    try {
        const { token } = req.headers;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: true,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (UserData.accountType == "seller") {
            const SellerData = await SellerDB.findById(UserData.sellerId);

            return res.status(200).json({
                success: true,
                full_name: UserData.fullName,
                email: UserData.email,
                phone_number: UserData.phoneNumber,
                account_type: UserData.accountType,
                company_name: SellerData.companyName,
                gst_number: SellerData.gstNumber,
                kyc_isverified: SellerData.kycIsVerified,
                bussiness_type: SellerData.bussinessType
            });
        }

        return res.status(200).json({
            success: true,
            full_name: UserData.fullName,
            email: UserData.email,
            phone_number: UserData.phoneNumber,
            address: UserData.address,
            account_type: UserData.accountType,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}


// PUT http://localhost:3000/api/users/profile
exports.UpdateUser = async (req, res) => {
    // updates user parameters provided in request body,
    // only normal user, for seller yet to do
    try {
        const { token } = req.headers;
        const { full_name, email, phone_number } = req.body;

        let UpdatedToken = token;
        
        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findById(DecodedToken.UserId);

        if (full_name) {
            UserData.fullName = full_name;
        }

        if (email) {
            const isPresentEmail = await UserAccountDB.findOne({ email: email });

            if (isPresentEmail) {
                return res.status(400).json({
                    success: false,
                    content: "credintials already exist",
                });
            }

            UserData.email = email;
        }

        if (phone_number) {
            const isPresentNumber = await UserAccountDB.findOne({ phoneNumber: phone_number });

            if (isPresentNumber) {
                return res.status(400).json({
                    success: false,
                    content: "credintials already exist",
                });
            }
            
            UserData.phoneNumber = phone_number;

            UpdatedToken = jwt.sign({
                UserId: DecodedToken.UserId,
                PhoneNumber: phone_number
            }, process.env.JWTKEY, {
                expiresIn: '183d'
            });
        }

        await UserData.save();

        return res.status(200).json({
            success: true,
            token: UpdatedToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// DELETE http://localhost:3000/api/users/profile
exports.DeleteUser = async (req, res) => {
    // deletes user account with details permanently
    try {
        const { token } = req.headers;
        
        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: false,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findOneAndDelete({ phoneNumber: DecodedToken.PhoneNumber });

        return res.status(200).json({
            success: true,
            content: "account deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}
