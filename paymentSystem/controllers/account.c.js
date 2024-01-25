const accountModel = require('../models/account.m');

module.exports = {
    addAccount: async(req,res,next) => {
        const account = req.body.account;
        console.log('Account got from main system', req.body.account);
        accountModel.addAccount(account.user_id, account.balance);
        // TRẢ VỀ TOKEN
        res.status(200).json({message: 'Account added'});
    }
}