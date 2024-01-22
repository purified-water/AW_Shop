const userModel = require('../models/users.m.js');

module.exports = {
    updateUser: async(req, res, next) => {
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
    loadProfile: async(req,res,next) => {
        try {
            res.render('profile',{user: req.user[0], pageTitle: "Profile"});
        }
        catch(e){
            console.log(e);
        }
    }
}