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

        // check if email and mobile number already exists
        const isPresentEmail = await UserAccountDB.findOne({ Email: email });
        const isPresentNumber = await UserAccountDB.findOne({ Email: mobile_number });

        if (isPresentEmail || isPresentNumber) {
            return res.status(203).json({
                status: 203,
                content: "credintials already exist",
            });
        }

        // hash the password
        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(password, salt);

        // store data in database
        const UserData = await UserAccountDB.create({
            AccountType: account_type,
            FullName: full_name,
            Email: email,
            MobileNumber: mobile_number,
            Password: hashedPwd,
        });

        // for seller account
        if (account_type.toLowerCase() === "seller") {
            const { company_name, bussiness_type, gst_number } = req.body;
            const SellerData = await SellerDB.create({
                CompanyName: company_name,
                BusinessType: bussiness_type,
                GSTNumber: gst_number,
                UniqueId: await Algorithms.generateUniqueString(),
            });
            UserData.SellerId = SellerData._id;
        }

        if (account_type.toLowerCase() === "buyer") {
            const BuyerData = await BuyerDB.create({});
            UserData.BuyerId = BuyerData._id;
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
            UserData.SellerId = SellerData._id;
            UserData.BuyerId = BuyerData._id;
            console.log(SellerData)
            console.log(BuyerData)
        }

        console.log(UserData)

        // create a token
        const Token = jwt.sign({
            UserId: UserData._id,
            Email: email
        }, process.env.JWTKEY, {
            expiresIn: '5d'
        }); 

        // send back respose
        return res.status(200).json({
            status: 200,
            token: Token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            content: error
        })

    }
}

// POST http://localhost:3000/user/login
// exports.UserLogin = (req, res) => {
//     const {mobile_number, password} = req.body;
// }