const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const UserAccountDB = require('../Models/UserAccountModel.js')
const SellerDB = require('../Models/SellerModel.js')
const BuyerDB = require('../Models/BuyerModel.js')
const Algorithms = require('./Algorithms.js')

dotenv.config()

// POST http://localhost:3000/user/register
exports.UserRegistration = async (req, res) => {
    try {
        const { full_name, email, account_type, mobile_number, password } = req.body;

        const isPresentEmail = await UserAccountDB.findOne({ Email: email });
        const isPresentNumber = await UserAccountDB.findOne({ Email: mobile_number });

        if (isPresentEmail || isPresentNumber) {
            return res.status(400).json({
                success: false,
                content: "credintials already exist",
            });
        }

        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(password, salt);

        const UserData = await UserAccountDB.create({
            AccountType: account_type.toLowerCase(),
            FullName: full_name,
            Email: email,
            MobileNumber: mobile_number,
            Password: hashedPwd,
        });

        if (account_type.toLowerCase() === "seller") {
            const { company_name, bussiness_type, gst_number } = req.body;
            const SellerData = await SellerDB.create({
                CompanyName: company_name,
                BusinessType: bussiness_type,
                GSTNumber: gst_number,
                UniqueId: await Algorithms.generateUniqueString(),
            });
            await UserAccountDB.findByIdAndUpdate(UserData, {
                SellerId: SellerData._id
            })
        }

        if (account_type.toLowerCase() === "buyer") {
            const BuyerData = await BuyerDB.create({});
            await UserAccountDB.findByIdAndUpdate(UserData, {
                BuyerId: BuyerData._id
            })
        }

        if (account_type.toLowerCase() === "both") {
            const { company_name, bussiness_type, gst_number } = req.body;
            const BuyerData = await BuyerDB.create({});
            const SellerData = await SellerDB.create({
                CompanyName: company_name,
                BussinessType: bussiness_type,
                GSTNumber: gst_number,
                UniqueId: await Algorithms.generateUniqueString(),
            });
            await UserAccountDB.findByIdAndUpdate(UserData._id, {
                SellerId: SellerData._id
            })
            await UserAccountDB.findByIdAndUpdate(UserData._id, {
                BuyerId: BuyerData._id
            })
        }

        const Token = jwt.sign({
            UserId: UserData._id,
            MobileNumber: mobile_number
        }, process.env.JWTKEY, {
            expiresIn: '5d'
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

// POST http://localhost:3000/user/login
exports.UserLogin = async (req, res) => {
    try {
        const { mobile_number, password } = req.body;

        const Data = await UserAccountDB.findOne({ MobileNumber: mobile_number });

        const isMatch = await bcrypt.compare(password, Data.Password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                content: "Incorrect Password"
            });
        }

        const Token = jwt.sign({
            UserId: Data._id,
            MobileNumber: mobile_number
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

// PUT http://localhost:3000/user/profile
exports.UpdateUser = async (req, res) => {
    try {
        const { token } = req.headers;
        const { full_name, email, mobile_number } = req.body;

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
            UserData.FullName = full_name;
        }

        if (email) {
            const isPresentEmail = await UserAccountDB.findOne({ Email: email });

            if (isPresentEmail) {
                return res.status(400).json({
                    success: false,
                    content: "credintials already exist",
                });
            }

            UserData.Email = email;
        }

        if (mobile_number) {
            const isPresentNumber = await UserAccountDB.findOne({ Email: mobile_number });

            if (isPresentNumber) {
                return res.status(400).json({
                    success: false,
                    content: "credintials already exist",
                });
            }
            
            UserData.MobileNumber = mobile_number;

            UpdatedToken = jwt.sign({
                UserId: DecodedToken.UserId,
                MobileNumber: mobile_number
            }, process.env.JWTKEY, {
                expiresIn: '5d'
            });
        }

        await UserData.save();

        return res.status(200).json({
            success: true,
            token: UpdatedToken,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}

// GET http://localhost:3000/user/profile
exports.GetUser = async (req, res) => {
    try {
        const { token } = req.headers;

        const DecodedToken = jwt.verify(token, process.env.JWTKEY);

        if (!DecodedToken) {
            return res.status(400).json({
                success: true,
                content: "invalid token"
            });
        }

        const UserData = await UserAccountDB.findOne({MobileNumber: DecodedToken.MobileNumber});

        if (UserData.AccountType === "seller" || UserData.AccountType === "both") {
            const SellerData = await SellerDB.findById(UserData.SellerId);

            return res.status(200).json({
                success: true,
                full_name: UserData.FullName,
                email: UserData.Email,
                mobile_number: UserData.MobileNumber,
                unique_id: SellerData.UniqueId,
                company_name: SellerData.CompanyName,
                gst_number: SellerData.GSTNumber,
                kyc_isverified: SellerData.KYCIsVerified,
                bussiness_type: SellerData.BussinessType
            });
        }

        return res.status(200).json({
            success: true,
            full_name: UserData.FullName,
            email: UserData.Email,
            mobile_number: UserData.MobileNumber,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            content: error.message
        });
    }
}