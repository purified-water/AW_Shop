const cartModel = require('../models/cart.m');
const userModel = require('../models/users.model');

module.exports = {
    renderCart: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id


            const cartItems = await cartModel.getItemInCart(parseInt(user_id));
            console.log('cartItems: ', cartItems);
            // Có thì hiện sản phẩm
            // Không thì hiện là giỏ trống
            res.render('cart', {cartItems: cartItems});
        } catch (error) {
            next(error);
        }
    },

    addItemToCartByID: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id

            const product_id = parseInt(req.params.id);

            const newItem = await cartModel.addProductToCartByID(user_id, product_id);
        } catch (error) {
            next(error);
        }
    },

    removeItemFromCartByID: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id

            const product_id = parseInt(req.params.id);

            const removeItem = await cartModel.removeProductFromCartByID(user_id, product_id);
        } catch (error) {
            next(error);
        }
    },

    removeAllCartItem: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id

            const removeAll = await cartModel.removeAllCartItem(user_id);
        } catch (error) {
            next(error);
        }
    }
}
