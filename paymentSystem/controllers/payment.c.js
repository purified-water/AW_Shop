const paymentModel = require('../models/payment.m')
const db = require('../utils/db');

module.exports = {
    payWithWallet: async (req, res, next) => {
        try {
            const paymentInfo = req.body.shopOrder;
            // console.log('Payment info: ', paymentInfo);
            const userID = req.body.user_id;
            // console.log('User info', userID);
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

            //Lấy user info của admin
            const adminUser = await db.getCondition('users', 'username', 'admin');
            const adminUserID = adminUser[0].id;
            console.log('Admin id is: ', adminUserID);
            //Lấy account info của admin
            const adminAccount = await paymentModel.getAccount(adminUserID);

            console.log('Admin from account: ', adminAccount);
            //Trừ tiền của client và cộng tiền cho admin
            const newBalance = account[0].balance - paymentInfo.total;
            const newAdminBalance = parseInt(adminAccount[0].balance) + paymentInfo.total;
            console.log('New balance: ', newAdminBalance);


            await paymentModel.updateAccount(userID, newBalance);
            await paymentModel.updateAccount(adminUserID, newAdminBalance);
            res.status(200).json({ message: 'Payment success' });
        } catch (error) {
            res.status(400).json({
                message: 'Payment failed'
            });
        }


    },
        rechargeBalance: async (req, res, next) => {
        try {
            const userID = req.body.user_id;
            const account = await paymentModel.getAccount(userID);
            if (account.length == 0) {
                return res.status(400).json({
                    message: 'Account not found'
                })
            }
            const rechargeAmount = req.body.rechargeAmount;
            const recharge = await paymentModel.rechargeAccount(userID, rechargeAmount);


            // await paymentModel.updateAccount(userID,newBalance);
            res.redirect('https://localhost:3000/user/profile/')

        }
        catch (e) {
            console.log(e);
        }
    },
    
}