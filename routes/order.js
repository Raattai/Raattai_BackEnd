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



router.get('/order/:_id', async function(req, res) {
    try {
        const order_id = req.params._id; 
        if (!order_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log(order_id)
        const ordDetail = await Order.findOne({ order_id: order_id });
        console.log(txnDetail)
        if (!txnDetail) {
            return res.status(404).json({ error: 'Txn not found for the user' });
        }
        return res.status(200).json({ order: ordDetail});

    } catch (error) {
        console.error('Error fetching Txn Details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.get("/result_order",(req,res)=>{
//   res.send(to_store_order_transaction(temp))
// });

// to_store_order_transaction(temp)

//Exports
module.exports = latestOrder;
