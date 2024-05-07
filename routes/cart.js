var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');

router.get('/add-to-cart/:product', async function(req, res) {
    try {
        const slug = req.params.product; 
        const product = await Product.findOne({ slug: slug });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        let cart = req.session.cart || [];
        const existingProductIndex = cart.findIndex(item => item.title === product.title);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].qty++;
        } else {
            cart.push({
                title: product.title,
                qty: 1, 
                price: parseFloat(product.price).toFixed(2),
                image: product.image
            });
        }

        req.session.cart = cart;

        console.log(req.session.cart);
        return res.status(200).json({ success: 'Product added to the cart' });

    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/update/:product', function(req, res, next) {
    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if(cart[i].qty < 1) {
                        cart.splice(i, 1);
                        if (cart.length == 0) delete req.session.cart;
                    }
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break; 
        }
    }
    return res.status(200).json({ success: 'Cart updated' });
});

router.get('/clear', function(req, res) {
    delete req.session.cart;
    return res.status(200).json({ success: 'Cart cleared' });
});

router.get('/buynow', function(req, res) {
    delete req.session.cart;
    return res.sendStatus(200);
});

//Exports 
module.exports = router;
