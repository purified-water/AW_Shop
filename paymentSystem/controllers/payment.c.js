const paymentModel = require('../models/payment.m')
module.exports = {
    payWithWallet: async (req,res,next) => {
        const paymentInfo = req.body.shopOrder;
        console.log('Payment info: ', paymentInfo);
        const userID = req.body.user_id;
        console.log('User info', userID);
        const account = await paymentModel.getAccount(userID);
        if (account.length == 0) {
            return res.status(400).json({
                message: 'Account not found'
            })
        }
        if (account[0].balance < paymentInfo.total) {
            return res.status(400).json({
                message: 'Not enough money'
            })
        }

        const newBalance = account[0].balance - paymentInfo.total;
        console.log('New balance: ', newBalance);
        await paymentModel.updateAccount(userID, newBalance);
        res.status(200).json({message: 'Payment success'});

    }
}