var express = require("express");
var router = express.Router();
var Order = require("../models/order.js");

router.get("/order/:_id", async function (req, res) {
  try {
    const order_id = req.params._id;
    if (!order_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(order_id);
    const ordDetail = await Order.findOne({ _id: order_id });
    console.log(ordDetail);
    if (!ordDetail) {
      return res.status(404).json({ error: "Txn not found for the user" });
    }
    return res.status(200).json({ order: ordDetail });
  } catch (error) {
    console.error("Error fetching Txn Details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Exports
module.exports = router;
