const users = require("../models/users.m");
const products = require("../models/prod.m");
const categories = require("../models/cate.m");
const shop_order = require("../models/shop_order.m");

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
      // Gọi hàm tìm user mua nhiều nhất
      const sortCustomerByAmount = await getCustomersSortedByTotalAmount(order, customer);
      const sortCustomerByOrder = await getUsersSortedByOrderCount(order,customer);
        
    //   // Hiển thị kết quả
    //   console.log("User mua nhiều tiền nhất:");
    //   console.log(sortCustomerByAmount);

    //   console.log("User mua nhiều order nhất:");
    //   console.log(sortCustomerByOrder);
    
        console.log("Doanh thu ngày: ", orderDay);
        console.log("Doanh thu tháng: ", orderMonth);

      res.render("dashboard", {
        user: user,
        customerCount: sortCustomerByAmount.length,
        orderCount: order.length,
        customerAmount: sortCustomerByAmount,
        customerOrder: sortCustomerByOrder,
        revDay: orderDay.totalRevDay,
        revMonth: orderMonth.totalRevMonth,
        pageTitle: "Dashboard",
        cateListNav: cateList,
      });
    }
  },
};
