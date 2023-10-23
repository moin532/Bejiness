const Seller = require('../Models/SellerModel')

exports.generateUniqueString = async () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789'
    let uniqueString;
    uniqueString = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        uniqueString += alphabet.charAt(randomIndex);
    }

    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        uniqueString += numbers.charAt(randomIndex);
    }

    const data = await Seller.findOne({ UniqueId: uniqueString })

    if (data) {
        return generateUniqueString();
    }

    return uniqueString;
}
