const userModel = require('../models/users.m.js');
const accountModel = require('../models/account.m.js');
const db = require('../utils/db.js')
require('dotenv').config();
const rechargeLink = 'https://localhost:3000'
module.exports = {
    redirectVnPay: async (req, res, next) => {
        // console.log('redirect VNPAY')
        const rechargeAmount = parseInt(req.body.rechargeAmount);

        const params = {
            amount: rechargeAmount,
            bankCode: ''
            // Add more parameters as needed
        };

        // Replace with your server URL
        const serverUrl = 'https://localhost:8888/order/create_payment_url';

        // Use Fetch API to send a POST request
        try {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            let response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(params),
            })
            const data = await response.json()
            // console.log(data)
        } catch (e) {
            console.log(e)
        }
    },
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
            const orders = await db.getCondition('shop_order', 'user_id', id);

            const nav = await db.getCategories();
            // console.log(account);
            res.render('profile', { 
                user: req.user[0], 
                pageTitle: "Profile", 
                account: account[0], 
                orders: orders,
                cateListNav: nav
            });
        }
        catch (error) {
            // next(error);
            res.render("error",{error: error});
        }
    },
    rechargeBalance: async (req, res, next) => {
        try {
            const rechargeAmount = parseInt(req.body.rechargeAmount);
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id;
            // console.log("amount: ", rechargeAmount);
            // console.log("id: ", user_id);
            const token = req.cookies.jwt;
            // Xử lý lỗi self signed certificate in certificate chain
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            const result = await fetch(`https://localhost:8888/payment/recharge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ rechargeAmount: rechargeAmount, user_id: user_id }),
            });
            res.redirect('back');
        }
        catch (error) {
            // next(error);
            res.render("error",{error: error});

        }
    },
    rechargeBalanceVNPay: async (req, res, next) => {
        try {
            const rechargeAmount = parseInt(req.body.rechargeAmount);
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id;
            // console.log("amount: ", rechargeAmount);
            // console.log("id: ", user_id);
            // Xử lý lỗi self signed certificate in certificate chain
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            const result = await fetch(`https://localhost:8888/order/create_payment_url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rechargeAmount: rechargeAmount, user_id: user_id }),
            });
            console.log(result.json());
            res.redirect(result)
        }
        catch (error) {
            // next(error);
            res.render("error",{error: error});
        }
    },
    loadListUser: async (req, res, next) => {
        try {
            const id = req.user[0].id;
            const nav = await db.getCategories();
            const listUser = await db.getAll('users');
            const combinedData = [];

            for (const user of listUser) {
                const account = await accountModel.getAccount(user.id);
                // console.log('go here', account);
                combinedData.push({
                    user: user,
                    balance: account.length > 0 ? account[0].balance : 0
                });
            }

            // Remove the first user from the list
            combinedData.shift();

            res.render('manageUser', {
                user: req.user[0],
                pageTitle: "Manage User",
                cateListNav: nav,
                users: combinedData,
            });
        }
        catch (error) {
            // next(error);
            res.render("error",{error: error});
        }
    },
}