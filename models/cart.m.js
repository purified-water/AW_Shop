const db = require('../utils/db');

module.exports = {
    getProductByID: async (product_id) => {
        try {
            const product = await db.getCondition('products', 'id', product_id);
            return product;
        } catch (error) {
            console.log(error);
        }
    },
    addItemToCartByID: async (user_id, product_id, quantity) => {
        try {
            // Lấy cart_id từ user_id
            const cartQuery = await db.getCondition('cart', 'user_id', user_id);
            // console.log('User cart', cartQuery);
            // Kiểm tra xem có cart nào hay chưa
            let cartID;

            if (cartQuery) {
                if (cartQuery.length === 0) {
                    // Nếu chưa có cart, tạo mới cart
                    const newCart = await db.insert('cart', {
                        user_id: user_id
                    }, 'id');
                    cartID = newCart.id;
                }
                if (cartQuery && cartQuery.length > 0) {
                    cartID = cartQuery[0].id;
                }
            }
            let items;
            // Lấy items trong cart
            if (cartID !== undefined) {
                items = await db.getCondition('cart_items', 'cart_id', cartID);
            }
            // console.log('items: ', items);

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const item = items.find(item => item.product_id === product_id);
            // console.log('item: ', !item);

            // Nếu chưa có thì thêm vào
            if (!item) {
                const newItem = await db.insert('cart_items', {
                    cart_id: cartID,
                    product_id: product_id,
                    quantity: quantity
                }, 'id');
                // console.log('Item add to cart is', newItem);
                return newItem;
            }
            // Nếu có rồi thì tăng số lượng lên 1
            else {
                const newQuantity = item.quantity + 1;
                const newItem = await db.update('cart_items', {
                    quantity: newQuantity
                }, 'id', item.id);
                return newItem;
            }
        } catch (error) {
            console.log(error);

        }
    },

    getItemInCart: async (user_id) => {
        try {
            // Lấy cart_id từ user_id
            const cartQuery = await db.getCondition('cart', 'user_id', user_id);
            const cartID = cartQuery[0].id;

            // Lấy items trong cart
            const items = await db.getCondition('cart_items', 'cart_id', cartID);
            return items;
        } catch (error) {
            console.log(error);

        }
    },


    reduceCartItemByID: async (user_id, item_id) => {
        try {
            // Lấy cart_id từ user_id
            const cartQuery = await db.getCondition('cart', 'user_id', user_id);
            const conditions = [
                {
                    tbColumn: 'cart_id',
                    value: cartQuery[0].id
                },
                {
                    tbColumn: 'product_id',
                    value: item_id
                }
            ]
            const item = await db.getMultiConditions('cart_items', conditions);

            // console.log('Item to reduce', item);
            const itemQuantity = parseInt(item[0].quantity);
            let items;
            if (itemQuantity == 1) {
                // Xóa items trong cart
                items = db.deleteCondition('cart_items', 'id', item[0].id);
                // console.log('Reduce removed item');
            } else {
                const newQuantity = itemQuantity - 1;
                items = await db.update('cart_items', {
                    quantity: newQuantity
                }, 'id', item[0].id);
                // console.log('Reduce item quantity');
            }

            return items;
        } catch (error) {
            console.log(error);

        }
    },

    increaseCartItemByID: async (user_id, item_id) => {
        try {
            // Lấy cart_id từ user_id
            const cartQuery = await db.getCondition('cart', 'user_id', user_id);
            const conditions = [
                {
                    tbColumn: 'cart_id',
                    value: cartQuery[0].id
                },
                {
                    tbColumn: 'product_id',
                    value: item_id
                }
            ]
            const item = await db.getMultiConditions('cart_items', conditions);

            // console.log('Item to reduce', item);
            const itemQuantity = parseInt(item[0].quantity);
            let items;

            const newQuantity = itemQuantity + 1;
            items = await db.update('cart_items', {
                quantity: newQuantity
            }, 'id', item[0].id);



            return items;
        } catch (error) {
            console.log(error);

        }
    },
    removeCartItemByID: async (user_id, item_id) => {
        try {
            // Lấy cart_id từ user_id
            const cartQuery = await db.getCondition('cart', 'user_id', user_id);
            const conditions = [
                {
                    tbColumn: 'cart_id',
                    value: cartQuery[0].id
                },
                {
                    tbColumn: 'product_id',
                    value: item_id
                }
            ]
            const item = await db.getMultiConditions('cart_items', conditions);


            // Chọn item nào thì sẽ lấy id của item đó rồi truyền vào đây xóa
            const items = db.deleteCondition('cart_items', 'id', item[0].id);
            // console.log('Removed item');
            return items;
        } catch (error) {
            console.log(error);

        }
    },

    removeAllCartItem: async (user_id) => {
        try {
            // Lấy cart_id từ user_id
            const cartQuery = await db.getCondition('cart', 'user_id', user_id);
            const cartID = cartQuery[0].id;

            // Xóa items trong cart
            const items = db.deleteCondition('cart_items', 'cart_id', cartID);
            return items;
        } catch (error) {
            console.log(error);

        }
    }


}