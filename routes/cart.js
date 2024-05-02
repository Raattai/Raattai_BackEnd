var express =require('express');
var router = express.Router();
var Product = require('../models/product.js'); 

router.get('/add-to-cart/:product', async function(req, res) {
    try {
        const slug = req.params.product; 
        const product = await Product.findOne({ slug: slug });
        if (!product) {
            throw new Error('Product not found');
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
                image: '/product_images/' + product._id +'/' + product.image
            });
        }

        req.session.cart = cart;

        console.log(req.session.cart);
        req.flash('success', 'Product added to the cart');
        res.redirect('back');

    } catch (error) {
        console.error('Error finding page:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Get checkout page
router.get('/checkout', async function(req, res) {

    if(req.session.cart && req.session.cart.length == 0)
    {
        delete req.session.cart;
        res.redirect('/user/cart/checkout');
    }else{
    res.render('checkout',{
        title: 'Checkout',
        cart: req.session.cart,
      
    });
}
});

router.get('/update/:product', function(req, res, next) { // Add next parameter
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
                    if(cart[i].qty < 1)
                    {
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
    req.flash('sucess','Cart Updated');
    res.redirect('/user/cart/checkout');
    next(); // Call next to proceed to the next middleware or route handler
});

router.get('/clear',function(req,res){
        
    delete req.session.cart;

    req.flash('success','Cart cleared!');
    res.redirect('/checkout');
})

router.get('/buynow',function(req,res){
        
    delete req.session.cart;
    res.sendStatus(200);
})

//Exports 
module.exports=router;