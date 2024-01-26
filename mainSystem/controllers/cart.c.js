const cartModel = require('../models/cart.m');
const userModel = require('../models/users.m');
const detailModel = require('../models/detail_order.m');
require('dotenv').config();
const paymentLink = 'https://localhost:8888'
const shopOrderModel = require('../models/shop_order.m');
const moment = require('moment');
const db = require('../utils/db');

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
    renderCart: async (req, res, next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            console.log('User when render cart', user);
            const user_id = user[0].id

            const nav = await db.getCategories()
            const cartItems = await cartModel.getItemInCart(parseInt(user_id));
            const cartID = await cartModel.getCartID(parseInt(user_id));
            // Lấy cart id
            const total = await getCartTotal(user_id, cartID);

            if (cartItems.length == 0) {
                return res.render('cart', {
                    user: req.user[0],
                    cartItems: [],
                    cartID: cartID,
                    pageTitle: "Cart",
                    total: 0,
                    cateListNav: nav,
                });
            }
            // console.log('cartItems: ', cartItems);
            let products = [];
            for (let i = 0; i < cartItems.length; i++) {
                let product = await cartModel.getProductByID(cartItems[i].product_id);
                // console.log('Product đã lấy là', product);
                product[0].quantity = cartItems[i].quantity; // Add quantity attribute
                products.push(product[0]);
            }


            // console.log('products', products);


            res.render('cart', {
                user: req.user[0],
                cartItems: products,
                cartID: cartID,
                pageTitle: "Cart",
                total: total,
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    },

    loadFormInfo: async (req, res, next) => {
        try {
            res.render("formInfo");
        }
        catch (e) {
            console.log(e);
        }
    },

    addItemToCartByID: async (req, res, next) => {
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

    reduceItemFromCartByID: async (req, res, next) => {
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
    increaseItemFromCartByID: async (req, res, next) => {
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
    removeItemFromCartByID: async (req, res, next) => {
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

    removeAllCartItem: async (req, res, next) => {
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



    payWithWallet: async (req, res, next) => {
        const cartID = parseInt(req.query.cart_id);
        // Lấy ngày hiện tại để làm orderID và date
        let date = new Date();
        let createDate = moment(date);
        let orderId = moment(date).format('DDHHmmss');
        // Lấy user để query cart theo user_id
        const user = await userModel.getUserByEmail(req.session.passport.user);
        const user_id = user[0].id;
        const total = await getCartTotal(user_id, cartID);


        const shopOrderConditions = [
            {
                tbColumn: 'cart_id',
                value: cartID
            },
            {
                tbColumn: 'user_id',
                value: user_id
            },
            {
                tbColumn: 'status',
                value: 'Processing'
            }
        ];
        const shopOrderConditionsFailed = [
            {
                tbColumn: 'cart_id',
                value: cartID
            },
            {
                tbColumn: 'user_id',
                value: user_id
            },
            {
                tbColumn: 'status',
                value: 'Failed'
            }
        ];
        let shopOrder = {};
        let editingExistingOrder = false;
        // Query thử đã có order trong shop_order chưa
        let orderQuery = await db.getMultiConditions('shop_order', shopOrderConditions);
        // let failedOrderQuery = await db.getMultiConditions('shop_order', shopOrderConditionsFailed);
        if (orderQuery.length > 0) {
            // Nếu có order đang processing thì update lại order đó
            shopOrder = orderQuery[0];
            editingExistingOrder = true;
        } else {
            // // Nếu đang fail thì thêm dòng mới với id như đã có
            // if (failedOrderQuery.length > 0) {
            //     shopOrder = failedOrderQuery[0];
            //     // Gán giá trị id của đơn hàng mới là id của đơn hàng fail
            //     orderId = shopOrder.id;
            // }
            // Còn không thì gán để thêm mới
            shopOrder = await shopOrderModel.createOrder(parseInt(orderId), user_id, cartID, total, createDate, '', 'Wallet');
            editingExistingOrder = false;
        }

        // console.log(`Payment link is ${paymentLink}/payment/payWithWallet`);

        // Xử lý lỗi self signed certificate in certificate chain
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

        
        // Nếu đang chỉnh sửa order
        if (editingExistingOrder) {
            // Cập nhật orderID
            orderId = shopOrder.id;
        }

        // thay đổi status của order
        if (result.status !== 200) {
            console.log('Error in payment with wallet');
            // Nếu trong shop_order có order đó và đang là processing thì update thành failed
            const updateOrder = await shopOrderModel.updateOrderStatus(parseInt(orderId), 'Failed');
            // Nếu mà lỗi thì 
            res.render('payFailed', { user: req.user[0] });
        }
        else {
            // res.render('paymentSuccess');
            console.log('Payment with wallet success');
             
            const itemCart = await cartModel.getItemInCart(user_id);
            console.log(itemCart);
            if (itemCart.length > 0) {
                for (const cartItem of itemCart) {
                    const detailOrder = await detailModel.createDetail(parseInt(orderId), parseInt(cartItem.product_id), createDate, cartItem.quantity);
                }
            }
            // Xóa items khỏi cart
            const remove = await cartModel.removeAllCartItem(user_id);
            // Nếu trong shop_order có order đó và đang là processing thì update thành success
            const updateOrder = await shopOrderModel.updateOrderStatus(parseInt(orderId), 'Success');
            // Thêm item vào bảng order_detail
            res.render('paySuccess', { user: req.user[0] });
        }


    }
}
