// const userModels = require('../models/user.m');
const bcrypt = require('bcrypt')
const users = []
let i = 0

module.exports = {
    users: users,
    register_post: async (req, res, next) => {
        // console.log(req.body);
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            users.push( {
                id: i++,
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hashedPassword
            })
            // console.log(users)
            res.redirect('/login');
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