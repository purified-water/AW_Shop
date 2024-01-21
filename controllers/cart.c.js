const cartModel = require('../models/cart.m');
const userModel = require('../models/users.m');

module.exports = {
    renderCart: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id


            const cartItems = await cartModel.getItemInCart(parseInt(user_id));
            // console.log('cartItems: ', cartItems);
            let products = [];
            for (let i = 0; i < cartItems.length; i++) {
                let product = await cartModel.getProductByID(cartItems[i].product_id);
                product[0].quantity = cartItems[i].quantity; // Add quantity attribute
                products.push(product[0]);
            }
            // console.log('products', products);

            // Có thì hiện sản phẩm
            // Không thì hiện là giỏ trống
            res.render('cart', {cartItems: products});
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

            const product_id = parseInt(req.query.id);
            const quantity = parseInt(req.body.quantity);
            const newItem = await cartModel.addItemToCartByID(user_id, product_id, quantity);
            // console.log('New item added to cart', newItem);
            res.redirect('back');
        } catch (error) {
            next(error);
        }
    },

    reduceItemFromCartByID: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id

            const product_id = parseInt(req.params.id);

            const removeItem = await cartModel.reduceCartItemByID(user_id, product_id);
            res.redirect('back');
        } catch (error) {
            next(error);
        }
    },
    increaseItemFromCartByID: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            const user_id = user[0].id

            const product_id = parseInt(req.params.id);

            const increaseItem = await cartModel.increaseCartItemByID(user_id, product_id);
            res.redirect('back');
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

            const removeItem = await cartModel.removeCartItemByID(user_id, product_id);
            res.redirect('back');
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
