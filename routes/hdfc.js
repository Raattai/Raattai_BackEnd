const express = require('express');
const bodyParser = require('body-parser');
const { confirmOrder, cancelOrder, fetchOrderStatus } = require('../utils/hdfc');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/confirm-order', async (req, res) => {
  try {
    const orders = req.body.orders;
    const response = await confirmOrder(orders);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/cancel-order', async (req, res) => {
  try {
    const orders = req.body.orders;
    const response = await cancelOrder(orders);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/order-status', async (req, res) => {
  try {
    const order = req.body.order;
    const response = await fetchOrderStatus(order);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
