var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');
var Cart = require('../models/cart.js')
var mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SHY23FDA45G2G1K89KH5sec4H8KUTF85ret';


function authenticateToken(req, res, next) {
    const token = req.headers['authorization']; 
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.userId = decoded.userId; // Set userId in the request object for later use
        next();
    });
}

router.post('/add-to-cart/:product/:qty', authenticateToken, async function(req, res) {
    try {
        const slug = decodeURIComponent(req.params.product);
        const qty = req.params.qty
        const product = await Product.findOne({ slug: slug });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const userId = req.userId; // Get userId from the authenticated request
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        const existingProductIndex = cart.items.findIndex(item => item.product.equals(product._id));
        if (existingProductIndex !== -1) {
            cart.items[existingProductIndex].quantity++;
        } else {
            cart.items.push({ product: product._id, quantity: qty });
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

router.get('/my-cart', authenticateToken,async function(req, res) {
    try {
       const userId = req.userId;
         console.log(userId)
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userCart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found for the user' });
        }

        let total = 0;

        for (const cartItem of userCart.items) {
            const product = await Product.findById(cartItem.product);

            if (product) {
                total += cartItem.quantity * product.price;
            }
        }
     

        return res.status(200).json({ cart: userCart, total: total,count: userCart.items.length });

    } catch (error) {
        console.error('Error fetching user cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.get('/total/:_id', async function(req, res) {
//     try {
//         const userId = req.params._id;
        
//         // Find the user's cart
//         const userCart = await Cart.findOne({ user: userId });

//         if (!userCart) {
//             return res.status(404).json({ error: 'Cart not found for the user' });
//         }

//         let total = 0;

//         // Iterate over each item in the cart
//         for (const cartItem of userCart.items) {
//             // Find the corresponding product
//             const product = await Product.findById(cartItem.product);

//             if (product) {
//                 // Calculate the total value of the item and add it to the total
//                 total += cartItem.quantity * product.price;
//             }
//         }

//         return res.status(200).json({ total });
//     } catch (error) {
//         console.error('Error calculating cart total:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



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
