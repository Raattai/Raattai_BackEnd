var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');
var Cart = require('../models/cart.js')
var Transaction = require('../models/transaction.js');
var mongoose = require('mongoose');

router.post('/add-to-cart/:product/:_id', async function(req, res) {
    try {
        const slug = req.params.product; 
        const product = await Product.findOne({ slug: slug });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const userId = req.params._id; 
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        const existingProductIndex = cart.items.findIndex(item => item.product.equals(product._id));
        if (existingProductIndex !== -1) {
            cart.items[existingProductIndex].quantity++;
        } else {
            cart.items.push({ product: product._id, quantity: 1 });
        }
        await cart.save();
        console.log(cart);
        return res.status(200).json({ success: 'Product added to the cart' });

    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// router.get('/add-to-cart/:product', async function(req, res) {
//     try {
//         const slug = req.params.product; 
//         const product = await Product.findOne({ slug: slug });
//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }
//         let cart = req.session.cart || [];
//         const existingProductIndex = cart.findIndex(item => item.title === product.title);
//         if (existingProductIndex !== -1) {
//             cart[existingProductIndex].qty++;
//         } else {
//             cart.push({
//                 title: product.title,
//                 qty: 1, 
//                 price: parseFloat(product.price).toFixed(2),
//                 image: product.image
//             });
//         }

//         req.session.cart = cart;

//         console.log(req.session.cart);
//         return res.status(200).json({ success: 'Product added to the cart' });

//     } catch (error) {
//         console.error('Error adding product to cart:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// router.get('/update/:product', function(req, res, next) {
//     var slug = req.params.product;
//     var cart = req.session.cart;
//     var action = req.query.action;

//     for (var i = 0; i < cart.length; i++) {
//         if (cart[i].title == slug) {
//             switch (action) {
//                 case "add":
//                     cart[i].qty++;
//                     break;
//                 case "remove":
//                     cart[i].qty--;
//                     if(cart[i].qty < 1) {
//                         cart.splice(i, 1);
//                         if (cart.length == 0) delete req.session.cart;
//                     }
//                     break;
//                 case "clear":
//                     cart.splice(i, 1);
//                     if (cart.length == 0) delete req.session.cart;
//                     break;
//                 default:
//                     console.log('update problem');
//                     break;
//             }
//             break; 
//         }
//     }
//     return res.status(200).json({ success: 'Cart updated' });
// });

// router.get('/clear', function(req, res) {
//     delete req.session.cart;
//     return res.status(200).json({ success: 'Cart cleared' });
// });

router.get('/my-cart/:_id', async function(req, res) {
    try {
        const userId = req.params._id; 
        console.log(userId)
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Find the user's cart
        const userCart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found for the user' });
        }

        let total = 0;

        // Iterate over each item in the cart
        for (const cartItem of userCart.items) {
            // Find the corresponding product
            const product = await Product.findById(cartItem.product);

            if (product) {
                // Calculate the total value of the item and add it to the total
                total += cartItem.quantity * product.price;
            }
        }

        return res.status(200).json({ cart: userCart, total: total });

    } catch (error) {
        console.error('Error fetching user cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/txn/:_id', async function(req, res) {
    try {
        const txnId = req.params._id; 
        if (!txnId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log(txnId)
        // Find the user's cart
        const txnDetail = await Transaction.findOne({ txnId: txnId });
        //const products = await Transaction.find(); // Find all txns
        console.log(txnDetail)
        if (!txnDetail) {
            return res.status(404).json({ error: 'Txn not found for the user' });
        }
        return res.status(200).json({ transaction: txnDetail});

    } catch (error) {
        console.error('Error fetching Txn Details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/count/:_id', async function(req, res) {
    try {
        const userId = req.params._id; 
         const cartCount = await Cart.aggregate([
            { $match: { user: userId } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$user",
                    totalItems: { $sum: "$items.quantity" }
                }
            }
        ]);

        const count = cartCount.length > 0 ? cartCount[0].totalItems : 0;

        return res.status(200).json({ count });

    } catch (error) {
        console.error('Error counting cart items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.post('/save-now', async function(req, res) {
//     try {
//         const cart = req.session.cart || [];
//         const userId = req.session.userId; 
//         if (cart.length > 0 && userId) {
//             await Cart.findOneAndUpdate(
//                 { user: userId },
//                 { $set: { items: cart } },
//                 { upsert: true }
//             );
//         }

//         delete req.session.cart;
//         return res.sendStatus(200);

//     } catch (error) {
//         console.error('Error processing purchase:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



//Exports 
module.exports = router;
