var express = require("express");
var router = express.Router();
var Order = require("../models/order.js");

router.get("/latestOrder", async function (req, res) {
  try {
    let orderNumber = 0;
    // Find the user's cart
    const orders = await Order.find();
    if (orders.length > 0) {
      orderNumber = orders[orders.length - 1].orderNumber + 1;
    } else {
      return res.status(200).json({ orderNumber: orderNumber });
    }

    return res.status(200).json({ orderNumber: orderNumber });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function latestOrder() {
  try {
    let orderNumber = 0;
    // Find the user's cart
    const orders = await Order.find();
    if (orders.length > 0) {
      orderNumber = orders[orders.length - 1].orderNumber + 1;
      return orderNumber;
    } else {
        return orderNumber + 1;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return 'error';
  }
};

async function to_store_order_transaction(res) {
  try {
      const order_transaction = new Order(res);
       const result= await order_transaction.save();
        console.log(result)
  } catch (error) {
    console.error("Error fetching orders:", error);
    return 'error';
  }
 };
 
// app.get("/result_order",(req,res)=>{
//   res.send(to_store_order_transaction(temp))
// });

// to_store_order_transaction(temp)

//Exports
module.exports = latestOrder;
