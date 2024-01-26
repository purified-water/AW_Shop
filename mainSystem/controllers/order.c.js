const shop_order = require('../models/shop_order.m')
const detail_order = require('../models/detail_order.m')
const db = require('../utils/db');
async function getCartTotal(orderItems) {
    let total = 0;

    if (!orderItems) {
        return 0;
    }
    for (let i = 0; i < orderItems.length; i++) {
        total += orderItems[i].product.price * orderItems[i].quantity;
        // console.log('item', total);
    }

    return total;
}
module.exports = {
    loadOrder: async (req,res,next) => {
        try {       
            let nav = await db.getCategories()
            const orders = await db.getAll('shop_order')
            // console.log(orderDay)
            res.render('order',{
                user: req.user[0],
                orders: orders,
                pageTitle: "Orders",
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    },
    loadOrderDetail: async (req, res, next) => {
        try {       
            let nav = await db.getCategories()

            const detailQuery = await detail_order.getDetailOrder(parseInt(req.params.order_id));
            let detail = [];
            for (let i = 0; i < detailQuery.length; i++) {
                const product = await db.getCondition('products', 'id', detailQuery[i].product_id);
                detail.push({
                    product: product[0],
                    date: detailQuery[i].date,
                    quantity: detailQuery[i].quantity
                })
            }
            const total = await getCartTotal(detail);
            console.log('detail is: ', detail);
            res.render('orderDetail',{
                user: req.user[0],
                detail: detail,
                order_id: req.params.order_id,
                total: total,
                pageTitle: "Order Detail",
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    }
    
}