// const userModels = require('../models/user.m');
// const bcrypt = require('bcrypt')

module.exports = {
    signUp: async (req, res, next) => {
            res.redirect("/");
            
    },
    loadRegister: (req,res,next) => {
        res.render("register");
    }
}