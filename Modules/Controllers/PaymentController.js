const Razorpay = require("razorpay")
const crypto = require("crypto")

// POST http://localhost:3000/api/payment/place-order
exports.OrderPayment = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_API_SECRET
        })

        const options = req.body;
        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(400).json({
                success: false,
                content: "cannot place order"
            })
        }

        res.status(200).json({
            success: true,
            order: order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            content: error.message
        })
    }
}

// POST http://localhost:3000/api/payment/order/validate
exports.ValidateOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    
        const sha = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        // order_id + "|" + razorpay_payment_id
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest("hex")
        if (digest !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                content: "Transaction is not legit!"
            })
        }
    
        res.status(200).json({
            success: true,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            content: error.message
        })
    }
}