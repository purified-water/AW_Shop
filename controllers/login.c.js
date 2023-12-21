// const userModels = require('../models/user.m');
// const bcrypt = require('bcrypt')

module.exports = {
    
    login_get: (req,res,next) => {
        res.render("login");
    }
}