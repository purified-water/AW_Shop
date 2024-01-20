const userModel = require('../models/users.m.js');

module.exports = {
    updateUser: async(req, res, next) => {
        try {
            const id = req.params.id;
            const username = req.body.username;
            const password = req.body.password;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const phone = req.body.phone;
            const city = req.body.city;
            const street = req.body.street;
            const zipcode = req.body.zipcode;
            const data = await userModel.updateUser(id, username, password, firstname, lastname, phone, city, street, zipcode);
            res.redirect('back');
        }
        catch (e) {
            throw e
        }
    },
    loadProfile: async(req,res,next) => {
        try {
            res.render('profile');
        }
        catch(e){
            console.log(e);
        }
    }
}