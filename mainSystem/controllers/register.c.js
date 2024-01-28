// const userModels = require('../models/user.m');
const bcrypt = require('bcrypt')
const Users = require('../models/users.m')
const db = require('../utils/db')
let i = 0

module.exports = {
    register_post: async (req, res, next) => {
        // console.log(req.body);
        let firstname = req.body.firstname
        let lastname = req.body.lastname
        let username = req.body.username
        let email = req.body.email
        let password = req.body.password
        let phone = req.body.phone
        let isValid = true;

        let regex = /^[A-Z][a-zA-Z]*$/
        if (!firstname.match(regex)) {
            firstname = 'The fist name must only contain letters and the first letter must be capitalized!'
            isValid = false
        }
        if (!lastname.match(regex)) {
            lastname = 'The fist name must only contain letters and the first letter must be capitalized!'
            isValid = false
        }
        let users = await Users.getUserByEmail(email)
        // console.log('users', users);
        if (users.length > 0) {
            email = 'Email has been set before!'
            isValid = false
        }
        regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{4,}$/
        if (!username.match(regex)) {
            username = 'Username must be at least 4 characters, including letters and numbers!'
            isValid = false
        }
        users = await Users.getUserByUsername(username);
        if (users.length > 0) {
            username = 'Username has been set before!'
            isValid = false
        }
        regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/
        if (!password.match(regex)) {
            password = 'Password must have at least 6 characters, including letters and numbers!'
            isValid = false
        }
        regex = /^[0-9]{10}$/
        if (!phone.match(regex)) {
            phone = 'Phone must contain only 10 numbers!'
            isValid = false
        }
        if (!isValid) {
            console.log('not valid');
            return res.status(500).json({ firstname, phone, lastname, email, username, password, isValid })
        }
        try {
            console.log(req.body);
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                role: 'client',
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                city: '',
                street: '',
                zipcode: '',
            }
            const data = await Users.insert(user);
            // const queryAcc = `SELECT id FROM users where email = ${req.body.email}`
            const userQuery = await db.getCondition('users', 'email', req.body.email);
            console.log('User id register', userQuery[0].id);

            // Khởi tạo account user với 0 để test
            const account = {
                user_id: parseInt(userQuery[0].id),
                balance: 0
            }
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            console.log('Google account is', account);
            const jsonRes = await fetch('https://localhost:8888/account/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ account })
            })
            const jsonRes2 = await jsonRes.json();
            if (jsonRes.status !== 200) {
                console.log('Error when create account');
                return res.status(500).json({ message: 'Error when create account' });
            } else {
                console.log('Message from account', jsonRes2.message);
            }
            return res.status(200).json({ firstname, phone, lastname, email, username, password, isValid });
        }
        catch (e) {
            console.log(e)
            res.redirect('/register');
        }

    },
    register_get: (req, res, next) => {
        res.render("register", { pageTitle: "Register" });
    }
}