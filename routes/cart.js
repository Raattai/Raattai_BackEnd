var express =require('express');
var router = express.Router();
// Get product model
var Product = require('../models/product.js'); 
var Cart = require('../models/cart.js'); 



router.get('/add-to-cart/:productId', async function(req, res) {
    try {
        const productId = req.params.productId;

        // Find the product in the database using the product ID
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Retrieve the cart from the session
        let cart = req.session.cart || [];

        // Check if the product already exists in the cart
        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
            // If the product exists in the cart, increase its quantity
            existingItem.qty++;
        } else {
            // If the product is not found in the cart, add it to the cart with quantity 1
            cart.push({
                productId: productId,
                qty: 1,
                price: product.price,
                image: product.image
            });
        }

        // Update the cart in the session
        req.session.cart = cart;

        // If user is authenticated, save the cart data to the database
        if (req.isAuthenticated()) {
            const userId = req.user._id;
            let userCart = await Cart.findOne({ user: userId });
            console.log(userCart);
            if (!userCart) {
                userCart = new Cart({ user: userId, items: [] });
                console.log(userCart);
            }

            // Update the user's cart with the updated cart data
            userCart.items = cart;

            // Save the cart data to the database
            await userCart.save();
        }

        // Redirect the user back to the previous page
        res.redirect('back');

    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});
//Checkout 
router.get('/checkout', async function(req, res) {
    try {
        let cartItems = [];

        // Check if there is an existing cart in the session
        if (req.session.cart && req.session.cart.length > 0) {
            // Extract product IDs from the cart
            const productIds = req.session.cart.map(item => item.productId);

            // Fetch product data based on the product IDs
            const products = await Product.find({ _id: { $in: productIds } });

            // Map cart items with their corresponding product data
            cartItems = req.session.cart.map(cartItem => {
                const product = products.find(product => product._id.toString() === cartItem.productId.toString());
                return {
                    ...cartItem,
                    product: product // Add product data to each cart item
                };
            });
        }

        // Calculate total cart value
        const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

        // Render the checkout page with cart items and total
        res.render('checkout', {
            title: 'Checkout',
            cart: cartItems,
            total: total,
            user: req.user,
            page: {
                slug: 'checkout'
            }
        });
    } catch (error) {
        console.error('Error fetching cart items for checkout:', error);
        res.status(500).send('Internal Server Error');
    }
});




// Update cart
router.get('/update/:productId', async function(req, res, next) {
    try {
        const productId = req.params.productId;
        const cart = req.session.cart;
        const action = req.query.action;

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productId === productId) {
                switch (action) {
                    case "add":
                        cart[i].qty++;
                        break;
                    case "remove":
                        cart[i].qty--;
                        if (cart[i].qty < 1) {
                            cart.splice(i, 1);
                            if (cart.length === 0) delete req.session.cart;
                        }
                        break;
                    case "clear":
                        cart.splice(i, 1);
                        if (cart.length === 0) delete req.session.cart;
                        break;
                    default:
                        console.log('update problem');
                        break;
                }
                break; // Exit the loop after finding the matching product
            }
        }

        // Update cart in the database
        const userId = req.user._id; // Assuming user is authenticated
        const userCart = await Cart.findOneAndUpdate({ user: userId }, { items: cart }, { new: true });
        req.session.cart = cart;

        req.flash('success', 'Cart Updated');
        res.redirect('/user/cart/checkout');
    } catch (error) {
        console.error('Error updating cart:', error);
        req.flash('error', 'Failed to update cart');
        res.redirect('/user/cart/checkout');
    }
});

// Clear cart
router.get('/clear', async function(req, res) {
    try {
        const userId = req.user._id; // Assuming user is authenticated
        await Cart.findOneAndDelete({ user: userId });
        delete req.session.cart;
        req.flash('success', 'Cart cleared!');
        res.redirect('/checkout');
    } catch (error) {
        console.error('Error clearing cart:', error);
        req.flash('error', 'Failed to clear cart');
        res.redirect('/checkout');
    }
});

// Buy Now cart
router.get('/buynow', async function(req, res) {
    try {
        const userId = req.user._id; // Assuming user is authenticated
        await Cart.findOneAndDelete({ user: userId });
        delete req.session.cart;
        req.flash('success', 'Purchase successful!');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing purchase:', error);
        req.flash('error', 'Failed to process purchase');
        res.sendStatus(500);
    }
});

//Exports 
module.exports=router;