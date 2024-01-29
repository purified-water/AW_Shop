const cartModel = require('../models/cart.m');
const userModel = require('../models/users.m');
const detailModel = require('../models/detail_order.m');
const accountModel = require('../models/account.m');
require('dotenv').config();
const paymentLink = 'https://localhost:8888'
const shopOrderModel = require('../models/shop_order.m');
const moment = require('moment');
const db = require('../utils/db');

async function getCartTotal(user_id, cartID) {
    // console.log('Tính cartID', cartID);
    const cartItems = await cartModel.getItemInCart(parseInt(user_id));
    let total = 0;
    // console.log('Total calculating', cartItems);
    if (!cartItems) {
        return 0;
    }
    for (let i = 0; i < cartItems.length; i++) {
        let product = await cartModel.getProductByID(cartItems[i].product_id);
        total += product[0].price * cartItems[i].quantity;
        // console.log('item', total);
    }

    return total;
}

module.exports = {
    renderCart: async (req, res, next) => {
        try {
            // Lấy user để query cart theo user_id
            // user lấy ở passport
            const user = await userModel.getUserByEmail(req.session.passport.user);
            // console.log('User when render cart', user);
            const user_id = user[0].id
            const account = await accountModel.getAccount(user_id);


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
                    user_id: user_id,
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
                user_id: user_id,
                pageTitle: "Cart",
                total: total,
                cateListNav: nav,
            });
        } catch (error) {
            // next(error);
            res.render("error",{error: error});
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
            // next(error);
            res.render("error",{error: error});
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
            // next(error);
            res.render("error",{error: error});
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
            // next(error);
            res.render("error",{error: error});
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
            // next(error);
            res.render("error",{error: error});
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
            // next(error);
            res.render("error",{error: error});
        }
    },

    redirectVnPay: async (req, res, next) => {
        const cartID = parseInt(req.query.cart_id);
        // Lấy ngày hiện tại để làm orderID và date
        let date = new Date();
        let createDate = moment(date);
        let orderId = moment(date).format('DDHHmmss');
        // Lấy user để query cart theo user_id
        const user = await userModel.getUserByEmail(req.session.passport.user);
        const user_id = user[0].id;
        orderId = orderId.toString() + user_id.toString();
        console.log('order id thanh toán vnpay', orderId);
        // const total = await getCartTotal(user_id, cartID);

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

        // console.log('redirect VNPAY')
        const rechargeAmount = parseInt(req.body.rechargeAmount);

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
            shopOrder = await shopOrderModel.createOrder(parseInt(orderId), user_id, cartID, rechargeAmount, createDate, '', 'VNPay');
            editingExistingOrder = false;
        }

        const params = {
            amount: rechargeAmount,
            bankCode: ''
            // Add more parameters as needed
        };

        // Replace with your server URL
        const serverUrl = 'https://localhost:8888/order/create_payment_url';

        // Use Fetch API to send a POST request
        try {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            let response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(params),
            })
            if (response.redirected) {
                // Fetch the redirected URL
                response = await fetch(response.url);
            }
        
            const jsonRes = await response.json();
    

            console.log('Json response from vnpay', jsonRes);
            // Nếu đang chỉnh sửa order
            

            // console.log(data)
        } catch (e) {
            console.log(e)
        }
    },
    payWithVNPay: async (req, res, next) => {
        const order_id = req.query.order_id;
        const user_id = req.query.user_id;
        const paid = req.query.success;
        const rechargeAmount = parseInt(req.query.amount)/100;
        let date = new Date();
        let createDate = moment(date);


        //Lấy cart id
        const cartID = await cartModel.getCartID(parseInt(user_id));

        const shopOrderConditions = [
            {
                tbColumn: 'id',
                value: order_id
            },
            {
                tbColumn: 'status',
                value: 'Processing'
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
            shopOrder = await shopOrderModel.createOrder(parseInt(order_id), user_id, cartID, rechargeAmount, createDate, '', 'VNPay');
            editingExistingOrder = false;
        }


        // thay đổi status của order

        const itemCart = await cartModel.getItemInCart(user_id);
        // console.log('Item cart', itemCart);
        if (itemCart.length > 0) {
            for (const cartItem of itemCart) {
                const detailOrder = await detailModel.createDetail(parseInt(order_id), parseInt(cartItem.product_id), createDate, cartItem.quantity);
            }
        }
        if (paid != 'true') {
            console.log('Error in payment with wallet');
            // Nếu trong shop_order có order đó và đang là processing thì update thành failed
            const updateOrder = await shopOrderModel.updateOrderStatus(parseInt(order_id), 'Failed');
            // Nếu mà lỗi thì 
            res.render('payFailed', { user: req.user[0], message: "Giao dịch thất bại" });
        }
        else {
            // res.render('paymentSuccess');
            console.log('Payment with VNPay success');


            // Xóa items khỏi cart
            const remove = await cartModel.removeAllCartItem(user_id);
            // Nếu trong shop_order có order đó và đang là processing thì update thành success
            const updateOrder = await shopOrderModel.updateOrderStatus(parseInt(order_id), 'Success');
            // Thêm item vào bảng order_detail
            res.render('paySuccess', { user: req.user[0] });
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
        const token = req.cookies.jwt;
        orderId = orderId + user_id.toString();



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
                'Authorization': `Bearer ${token}`,

            },
            body: JSON.stringify({ shopOrder: shopOrder, user_id: user_id }),
        });
        const jsonRes = await result.json();


        // Nếu đang chỉnh sửa order
        if (editingExistingOrder) {
            // Cập nhật orderID
            orderId = shopOrder.id;
        }
        // thay đổi status của order

        const itemCart = await cartModel.getItemInCart(user_id);
        // console.log(itemCart);
        if (itemCart.length > 0) {
            for (const cartItem of itemCart) {
                const detailOrder = await detailModel.createDetail(parseInt(orderId), parseInt(cartItem.product_id), createDate, cartItem.quantity);
            }
        }
        if (result.status !== 200) {
            console.log('Error in payment with wallet');
            // Nếu trong shop_order có order đó và đang là processing thì update thành failed
            const updateOrder = await shopOrderModel.updateOrderStatus(parseInt(orderId), 'Failed');
            // Nếu mà lỗi thì 
            res.render('payFailed', { user: req.user[0], message: jsonRes.message });
        }
        else {
            // res.render('paymentSuccess');
            console.log('Payment with wallet success');


            // Xóa items khỏi cart
            const remove = await cartModel.removeAllCartItem(user_id);
            // Nếu trong shop_order có order đó và đang là processing thì update thành success
            const updateOrder = await shopOrderModel.updateOrderStatus(parseInt(orderId), 'Success');
            // Thêm item vào bảng order_detail
            res.render('paySuccess', { user: req.user[0] });
        }


    }

}
