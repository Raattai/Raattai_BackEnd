var express =require('express');
var router = express.Router();
const fs=require('fs');
var auth = require('../config/auth.js');
var isUser = auth.isUser;

var Product = require('../models/product.js');
var Blog = require('../models/blog.js');
const Service = require('../models/service');


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
  
  //Route to fetch Particular service 
  router.get('/services/:id', async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


module.exports=router;