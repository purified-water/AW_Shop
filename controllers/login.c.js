// const userModels = require('../models/user.m');
// const bcrypt = require('bcrypt')
const Users = require('../models/users.model');

module.exports = {
    
    login_get: (req,res,next) => {
        res.render("login");
    }
}