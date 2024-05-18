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

//Exports
module.exports = latestOrder;
