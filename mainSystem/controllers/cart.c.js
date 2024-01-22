const cartModel = require('../models/cart.m');
const userModel = require('../models/users.m');
require('dotenv').config();
const paymentLink = 'http://localhost:8888'
const shopOrderModel = require('../models/shop_order.m');
const moment = require('moment');

async function getCartTotal(user_id, cartID) {
    console.log('Tính cartID', cartID);
    const cartItems = await cartModel.getItemInCart(parseInt(user_id));    
    let total = 0;
    console.log('Total calculating', cartItems);
    if (!cartItems) {
        return 0;
    }
    for (let i = 0; i < cartItems.length; i++) {
        let product = await cartModel.getProductByID(cartItems[i].product_id);
        total += product[0].price * cartItems[i].quantity;
        console.log('item', total);
    } 
    
    return total;
}

module.exports = {
    renderCart: async (req,res,next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            console.log('User when render cart', user);
            const user_id = user[0].id


            const cartItems = await cartModel.getItemInCart(parseInt(user_id));
            const cartID = await cartModel.getCartID(parseInt(user_id));
            // Lấy cart id
            const total = await getCartTotal(user_id, cartID);

            if (cartItems.length == 0) {
                res.render('cart', {cartItems: [], cartID: cartID, pageTitle: "Cart", total: 0});
            }
            // console.log('cartItems: ', cartItems);
            let products = [];
            for (let i = 0; i < cartItems.length; i++) {
                let product = await cartModel.getProductByID(cartItems[i].product_id);
                console.log('Product đã lấy là', product);
                product[0].quantity = cartItems[i].quantity; // Add quantity attribute
                products.push(product[0]);
            }
            
            
            // console.log('products', products);


            res.render('cart', {cartItems: products, cartID: cartID, pageTitle: "Cart", total: total});
        } catch (error) {
            next(error);
        }
    },

    loadFormInfo: async(req,res,next) => {
        try {
            res.render("formInfo");
        }
        catch(e){
            console.log(e);
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
    },

    

    payWithWallet: async (req,res,next) => {
        const cartID = parseInt(req.query.cart_id);
        let date = new Date();
        //TO DO COI THỬ NGÀY ĐÚNG CHƯA
        let createDate = moment(date);
        console.log('Create date', createDate);
        let orderId = moment(date).format('DDHHmmss');
        const user = await userModel.getUserByEmail(req.session.passport.user);
        const user_id = user[0].id;
        const total = await getCartTotal(user_id, cartID);
        const shopOrder = await shopOrderModel.createOrder(parseInt(orderId), user_id, cartID, total, createDate, '' ,'Wallet');

        console.log(`Payment link is ${paymentLink}/payment/payWithWallet`);
        const result = await fetch(`${paymentLink}/payment/payWithWallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            //CHƯA CÓ TOKEN
            // 'Authorization': `Bearer ${token}`,
            body: JSON.stringify({ shopOrder: shopOrder, user_id: user_id }),
        });
        const jsonRes = await result.json();
        if (result.status !== 200) {
            console.log('Error in payment with wallet'); 
        }
        // else {
        //     // res.render('paymentSuccess');
        //     console.log('Payment with wallet success');
        // }

        // Xóa items khỏi cart
        const remove = await cartModel.removeAllCartItem(user_id);
        res.render('paySuccess');
    }   
}
