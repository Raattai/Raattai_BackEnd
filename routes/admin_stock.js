var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');
var Stock = require('../models/stock.js');

// Checkout
router.get('/stock', async function(req, res) {
    try {
        let stockItems = [];

        // Check if stock is defined in locals and it's not empty
        if (res.locals.stock && res.locals.stock.length > 0) {
            const productIds = res.locals.stock.map(item => item.productId);
            const products = await Product.find({ _id: { $in: productIds } });

            // Map stock items with their corresponding product data
            stockItems = res.locals.stock.map(stockItem => {
                const product = products.find(product => product._id.toString() === stockItem.productId.toString());
                return {
                    ...stockItem,
                    product: product // Add product data to each stock item
                };
            });
        }

        // Calculate total stock value
        const total = stockItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        console
        // Render the checkout page with stock items and total
        res.render('admin/stock', {
            title: 'Checkout',
            stock: stockItems,
            total: total,
            user: req.user,
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

        // Retrieve stock from locals
        let stock = res.locals.stock || [];

        // Find the item in the stock array
        const itemIndex = stock.findIndex(item => item.productId === productId);

        // Perform action based on query
        if (itemIndex !== -1) {
            switch (action) {
                case "add":
                    stock[itemIndex].quantity++;
                    break;
                case "remove":
                    stock[itemIndex].quantity--;
                    if (stock[itemIndex].quantity < 1) {
                        stock.splice(itemIndex, 1);
                    }
                    break;
                case "clear":
                    stock.splice(itemIndex, 1);
                    break;
                default:
                    console.log('Invalid action');
                    break;
            }
        }

        // Update locals with modified stock
        res.locals.stock = stock;

        req.flash('success', 'Stock Updated');
        res.redirect('/user/stock/checkout');
    } catch (error) {
        console.error('Error updating stock:', error);
        req.flash('error', 'Failed to update stock');
        res.redirect('/user/stock/checkout');
    }
});

// Clear stock
router.get('/clear', async function(req, res) {
    try {
        // Clear stock from locals
        delete res.locals.stock;

        req.flash('success', 'Stock cleared!');
        res.redirect('/checkout');
    } catch (error) {
        console.error('Error clearing stock:', error);
        req.flash('error', 'Failed to clear stock');
        res.redirect('/checkout');
    }
});

module.exports = router;
