var Order = require("../models/order.js");


var latestOrder = async function() {
    try {
        let orderNumber = 0;
        // Find the user's cart
        const orders = await Order.find();
    console.log(orders)
        if (orders.length > 0) {
          orderNumber = parseInt(orders[orders.length - 1].order_id) + 1;
          console.log(orderNumber);
          return orderNumber;
        } else {
          return orderNumber + 1;
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        return "error";
      }
  }, to_store_order_transaction = async function(res) {
    try {
        const order_transaction = new Order(res);
        const result = await order_transaction.save();
        console.log(result);
        return result;
      } catch (error) {
        console.error("Error fetching orders:", error);
        return "error";
      }
    }
  
  module.exports = {latestOrder: latestOrder, to_store_order_transaction: to_store_order_transaction};
