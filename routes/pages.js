var express =require('express');
var router = express.Router();
const fs=require('fs');
var Product = require('../models/product.js');
var Blog = require('../models/blog.js');

// Route to fetch all products
router.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//renders the raattai front end
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/web/index.html')); 
});

  // Route to fetch all blogs
  router.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


module.exports=router;