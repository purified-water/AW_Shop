// const userModels = require('../models/user.m');
// const bcrypt = require('bcrypt')

module.exports = {
    loginApp: async (req, res, next) => {
        // const { un, pw } = req.body;
        // console.log("REQUEST: " + un);
        // console.log("REQUEST: " + pw);
        // try {
        //     const user = await userModels.getUser(un);
        //     console.log(user)
        //     // Kiểm tra nếu người dùng không tồn tại
        //     if (!user) {
        //       return res.status(401).json({ message: 'Unauthorized - User not found' });
        //     }
        
        //     // So sánh mật khẩu
        //     const isPasswordValid = await bcrypt.compare(pw, user.Password);
        
        //     if (!isPasswordValid) {
        //       return res.status(401).json({ message: 'Unauthorized - Incorrect password' });
        //     }

        //     // req.session.uid = req.user.ID;
        //     req.session.un = user.Name;
        //     console.log(req.session.un);
            res.redirect("/category");
            
        // }   
        // catch (error) {
        //     next(error);
        // }
    },
    loadLogin: (req,res,next) => {
        res.render("login");
    }
}