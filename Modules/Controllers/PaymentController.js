const axios = require('axios');

const phonePeApiBaseUrl = 'https://api.phonepe.com';
const apiKey = '';

exports.ProcessPayment = async (req, res) => {
  try {
    const { amount, order_id, customer_id } = req.body;

    const response = await axios.post(
      `${phonePeApiBaseUrl}/v3/payment`,
      {
        amount: amount,
        orderId: order_id,
        customerId: customer_id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
          // Include other required headers
        },
      }
    );

    
    if (response.status === 200 && response.data.success) {
      res.status(200).json({ success: true, message: 'Payment successful!' });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed.' });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      content: error.message
    })
  }
}
