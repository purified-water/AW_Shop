// const userModels = require('../models/user.m');
// const bcrypt = require('bcrypt')
const Users = require('../models/users.m');
const products = require('../models/prod.m');
const categories = require('../models/cate.m');

module.exports = {

    loadHome: async (req, res) => {
        // console.log('Req user: ', req);
        const top5Products = await products.getTop5Products();
        const top5Categories = await categories.getTop5Categories();
        const deal = await products.getDeal();
      
        res.render("home", {
            user: req.user[0], 
            top5Products: top5Products, 
            top5Categories: top5Categories,
            deal: deal[0],
            pageTitle: "Homepage"
        });

    }
}