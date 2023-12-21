// const userModels = require('../models/user.m');
const bcrypt = require('bcrypt')
const Users = require('../models/users.model')
let i = 0

module.exports = {
    register_post: async (req, res, next) => {
        // console.log(req.body);
        let firstname = req.body.firstname
        let lastname = req.body.lastname
        let username = req.body.username
        let email = req.body.email
        let password = req.body.password
        let isValid = true;

        let regex = /^[A-Z][a-zA-Z]*$/
        if (!firstname.match(regex)) {
            firstname = 'Tên chỉ được chứa kí tự chữ và chữ cái đầu tiên phải được in hoa !'
            isValid = false
        }
        if (!lastname.match(regex)) {
            lastname = 'Tên chỉ được chứa kí tự chữ và chữ cái đầu tiên phải được in hoa !'
            isValid = false
        }
        let users = await Users.getUserByEmail(email)
        console.log('users', users);
        if (users.length > 0) {
            email = 'Tên email đã có người dùng !'
            isValid = false
        }
        regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{4,}$/
        if (!username.match(regex)) {
            username = 'Tên người dùng có ít nhất 4 ký tự, có cả chữ và số !'
            isValid = false
        }
        users = await Users.getUserByUsername(username);
        if (users.length > 0) {
            username = 'Tên người dùng đã có người đặt !'
            isValid = false
        }
        regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/
        if (!password.match(regex)) {
            password = 'Mật khẩu có ít nhất 6 ký tự, có cả chữ và số !'
            isValid = false
        }
        if (!isValid) {
            console.log('not valid');
            return res.json({firstname, lastname, email, username, password, isValid})
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
                phone: 'req.body.phone',
                city: 'req.body.city',
                street: 'req.body.street',
                zipcode: 'req.body.zipcode',
            }
            const data = await Users.insert(user);
            res.json({firstname, lastname, email, username, password, isValid})
        }
        catch (e) {
            console.log(e)
            res.redirect('/register');
        }
            
    },
    register_get: (req,res,next) => {
        res.render("register");
    }
}