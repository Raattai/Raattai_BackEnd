var express = require('express');
var router = express.Router();
var Product = require('../../models/product.js');
var Stock = require('../../models/stock.js');

// Checkout
router.get('/stock', async function(req, res) {
    try {
       const stock = Stock.find({})
        res.json({
            stock: stockItems,
            page: {
                slug: 'checkout'
            }
        });
    } catch (error) {
        console.error('Error fetching stock items for checkout:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update stock
router.get('/update/:productId', async function(req, res, next) {
    try {
        const productId = req.params.productId;
        const action = req.query.action;
        
    } catch (error) {
        console.error('Error updating stock:', error);
        req.flash('error', 'Failed to update stock');
        res.redirect('/user/stock/checkout');
    }
});


module.exports = router;
