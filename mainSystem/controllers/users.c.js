const userModel = require('../models/users.m.js');
const accountModel = require('../models/account.m.js');
require('dotenv').config();
const rechargeLink = 'https://localhost:8888'
module.exports = {
    updateUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            const username = req.body.username;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const phone = req.body.phone;
            const city = req.body.city;
            const street = req.body.street;
            const zipcode = req.body.zipcode;
            const data = await userModel.updateUser(id, username, firstname, lastname, phone, city, street, zipcode);
            res.redirect('back');
        }
        catch (e) {
            throw e
        }
    },
    loadProfile: async (req, res, next) => {
        try {
            const id = req.user[0].id;
            const account = await accountModel.getAccount(id);
            // console.log(account);
            res.render('profile', { user: req.user[0], pageTitle: "Profile", account: account[0], });
        }
        catch (e) {
            console.log(e);
        }
    },
    rechargeBalance: async (req, res, next) => {
        try {
            const rechargeAmount = parseInt(req.body.rechargeAmount);
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id;
            console.log("amount: ", rechargeAmount);
            console.log("id: ", user_id);
            // Xử lý lỗi self signed certificate in certificate chain
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            const result = await fetch(`${rechargeLink}/payment/recharge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ rechargeAmount: rechargeAmount, user_id: user_id }),
            });
            res.redirect('back');
        }
        catch (e) {
            console.log(e);
        }
    }
}