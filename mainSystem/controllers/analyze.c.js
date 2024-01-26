const shop_order = require('../models/shop_order.m')
const jsonUtils = require('../utils/json');
const db = require('../utils/db');

const calculateDailyRevenue = async (orders) => {
    // Khởi tạo đối tượng để lưu tổng doanh thu cho mỗi ngày
    const dailyRevenue = {};
  
    // Lặp qua từng đơn đặt hàng
    orders.forEach((order) => {
      // Lấy ngày của đơn đặt hàng
      const orderDate = new Date(order.date);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth() + 1; // Tháng bắt đầu từ 0
      const day = orderDate.getDate();
      // Tạo khóa để nhóm doanh thu theo ngày trong tháng
      const dayKey = `${year}-${month}-${day}`;
  
      // Nếu khóa đã tồn tại, cộng thêm số tiền vào tổng doanh thu
      if (dailyRevenue[dayKey]) {
        dailyRevenue[dayKey] += parseFloat(order.total);
      } else {
        // Nếu khóa chưa tồn tại, tạo mới với số tiền của đơn đặt hàng
        dailyRevenue[dayKey] = parseFloat(order.total);
      }
    });
  
    // Chuyển đối tượng dailyRevenue thành mảng các đối tượng { date, total }
    const dailyRevenueList = Object.keys(dailyRevenue).map((date) => {
        const dateNew = new Date(date)
        
      return {
        date: dateNew.toDateString().slice(0,10),
        total: dailyRevenue[date],
      };
    });
  
    return dailyRevenueList.reverse();
  };

module.exports = {
    loadAnalyze: async (req,res,next) => {
        try {       
            const orderDay = await shop_order.getRevenueDay();
            const orderMonth = await shop_order.getRevenueMonth();
            const nav = await db.getCategories()

            const listOrderMonth = await calculateDailyRevenue(orderMonth.query);
            console.log(listOrderMonth);
            // console.log(orderMonth)
            res.render('analyze',{
                user: req.user[0],
                orderListDay: JSON.stringify(orderDay.query),
                totalDay: orderDay.totalRevDay,
                orderListMonth: JSON.stringify(listOrderMonth),
                totalMonth: orderMonth.totalRevMonth,
                pageTitle: "Analyze",
                cateListNav: nav,
            });
        } catch (error) {
            next(error);
        }
    },
    getRevenueInDay: async (req, res, next) => {
        try {
            const orderDay = await shop_order.getRevenueDay();
            // console.log(orderDay);
            return orderDay;
        }
        catch(e){
            console.log(e);
        }
    }
    
}