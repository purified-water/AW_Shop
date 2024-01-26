const users = require("../models/users.m");
const products = require("../models/prod.m");
const categories = require("../models/cate.m");
const shop_order = require("../models/shop_order.m");
const detail_order = require("../models/detail_order.m");

async function getCustomersSortedByTotalAmount(orders, customers) {
  const totalAmountByUser = {};

  // Tính tổng số tiền đã mua của mỗi khách hàng
  orders.forEach((order) => {
    const userId = order.user_id;
    const totalAmount = parseInt(order.total);

    if (totalAmountByUser[userId]) {
      totalAmountByUser[userId] += totalAmount;
    } else {
      totalAmountByUser[userId] = totalAmount;
    }
  });

  // Sắp xếp danh sách khách hàng giảm dần theo số tiền đã mua
  const sortCustomerByAmounttomers = customers.sort((a, b) => {
    const totalAmountA = totalAmountByUser[a.id] || 0;
    const totalAmountB = totalAmountByUser[b.id] || 0;
    return totalAmountB - totalAmountA;
  });

  const result = sortCustomerByAmounttomers.map((customer) => {
    const totalAmount = totalAmountByUser[customer.id] || 0;
    return {
      username: customer.firstname + customer.lastname,
      totalAmount: totalAmount,
    };
  });

  return result;
}

async function getUsersSortedByOrderCount(orders, users) {
    const orderCountByUser = {};
  
    // Đếm số đơn đặt hàng của mỗi người dùng
    orders.forEach((order) => {
      const userId = order.user_id;
      
      if (orderCountByUser[userId]) {
        orderCountByUser[userId]++;
      } else {
        orderCountByUser[userId] = 1;
      }
    });
  
    // Sắp xếp danh sách người dùng giảm dần theo số đơn đặt hàng
    const sortedUsers = users.sort((a, b) => {
      const orderCountA = orderCountByUser[a.id] || 0;
      const orderCountB = orderCountByUser[b.id] || 0;
      return orderCountB - orderCountA;
    });
  
    const result = sortedUsers.map((user) => {
      const orderCount = orderCountByUser[user.id] || 0;
      return {
        username: user.firstname + user.lastname,
        orderCount: orderCount,
      };
    });
  
    return result;
}

async function getProductSortredByCount(details) {
  const productCounts = {};

  for (const detail of details) {
      const { product_id, quantity } = detail;

      if (productCounts[product_id] === undefined) {
          productCounts[product_id] = 0;
      }
      productCounts[product_id] += quantity;
  }

  const productCountsArray = Object.entries(productCounts);

  productCountsArray.sort((a, b) => b[1] - a[1]);

  const sortedProducts = await Promise.all(productCountsArray.map(async ([product_id, quantity]) => {
    const product = await products.getProductDetail(product_id);
    // console.log(product);
    return {
        product_id: parseInt(product_id),
        quantity: quantity,
        name: product[0].name,
    };
  }));

  return sortedProducts.slice(0,5);
}

module.exports = {
  loadHome: async (req, res) => {
    // console.log('Req user: ', req);
    const user = req.user[0];
    const cateList = await categories.getCates();
    if (user.role == "client") {
      const top5Products = await products.getTop5Products();
      const top5Categories = await categories.getTop5Categories();
      const deal = await products.getDeal();
      const cateList = await categories.getCates();
      res.render("home", {
        user: user,
        top5Products: top5Products,
        top5Categories: top5Categories,
        deal: deal[0],
        pageTitle: "Homepage",
        cateListNav: cateList,
      });
    } else {
      const customer = await users.getTotalCustomer();
      const order = await shop_order.getShopOrder();
      const orderDay = await shop_order.getRevenueDay();
      const orderMonth = await shop_order.getRevenueMonth();
      const detail = await detail_order.getAllDetailOrder();
      // Gọi hàm tìm user mua nhiều nhất
      const sortCustomerByAmount = await getCustomersSortedByTotalAmount(order, customer);
      const sortCustomerByOrder = await getUsersSortedByOrderCount(order,customer);
      const sortProduct = await getProductSortredByCount(detail);

      // // Hiển thị kết quả
      // console.log("User mua nhiều tiền nhất:");
      // console.log(sortCustomerByAmount);

      // console.log("User mua nhiều order nhất:");
      // console.log(sortCustomerByOrder);
    
      // console.log("Doanh thu ngày: ", orderDay);
      // console.log("Doanh thu tháng: ", orderMonth);

      console.log("Sản phẩm top: ", sortProduct);
        
      res.render("dashboard", {
        user: user,
        customerCount: sortCustomerByAmount.length,
        orderCount: order.length,
        customerAmount: sortCustomerByAmount,
        customerOrder: sortCustomerByOrder,
        mostBuyProduct: sortProduct,
        productCount: sortProduct.length,
        revDay: orderDay.totalRevDay,
        revMonth: orderMonth.totalRevMonth,
        pageTitle: "Dashboard",
        cateListNav: cateList,
      });
    }
  },
};
