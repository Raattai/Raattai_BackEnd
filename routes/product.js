var express =require('express');
var router = express.Router();
var Product = require('../models/product.js'); // Import the Category model
const { fstat } = require('fs-extra');
const fs=require('fs');
var auth = require('../config/auth.js');
var isUser = auth.isUser;
//get all products

router.get('/products', async function(req, res) {
    try {
        const products = await Product.find(); // Find all products

        res.render('all_products', {
            title: 'All Products',
            products: products ,
            user: req.user,
        });
    } catch (error) {
        console.error('Error finding products:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Product details route
router.get('/products/:product', async function(req, res) {
    try {
        const product = await Product.findOne({ slug: req.params.product }).exec();
        const loggedIn = (req.isAuthenticated()) ? true :false
        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('product', {
            title: product.title,
            p: product,
            page: {
                slug: 'gallery' 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



//Exports 
module.exports=router;