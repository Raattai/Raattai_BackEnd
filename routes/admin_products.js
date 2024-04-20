var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

// Get product model
var Product = require('../models/product.js'); 
const uploadGallery = require('../utils/gallery.js');
// Get product index 


router.get('/',isAdmin, async (req, res, next) => {
    try {
        const count = await Product.countDocuments({});
        const products = await Product.find({}).exec();
        res.render('admin/products', { products, count ,user: req.user});
    } catch (error) {
        console.error('Error counting products:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Get add product
router.get('/add-product', async (req, res) => {
  try {
      // Fetch categories here if needed
      res.render('admin/add_product', { user: req.user });
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
  }
});
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/product_images/');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
      return cb(null, true);
  } else {
      cb('Error: Images only!');
  }
}

// Add-product POST route
router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
      const { title, desc, price } = req.body;
      const image = req.file ? req.file.filename : '';

      // Check if any required field is missing
      if (!title || !desc || !price || !image) {
          req.flash('danger', 'All fields are required.');
          return res.redirect('/admin/products/add-product');
      }

      // Create a new product instance
      const newProduct = new Product({
          title: title,
          slug: title.toLowerCase(),
          desc: desc,
          price: price,
          image: image
      });

      // Save the product to the database
      await newProduct.save();

      req.flash('success', 'Product added successfully.');
      res.redirect('/admin/products');
  } catch (error) {
      console.error('Error adding product:', error);
      req.flash('danger', 'Error adding product.');
      res.redirect('/admin/products/add-product');
  }
});

// Get edit product
router.get('/edit-product/:_id', async function(req, res) {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const product = await Product.findOne({ _id: req.params._id });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const galleryDir = 'public/product_images/' + product._id + '/gallery';
    
    // Check if the gallery directory exists
    if (fs.existsSync(galleryDir)) {
      // Read the directory asynchronously
      fs.readdir(galleryDir, function(err, files){
        if(err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        } 
      
        // If no error, proceed with rendering the view
        const galleryImages = files;
        res.render('admin/edit_product', {
          title: product.title,
          errors: errors,
          desc: product.desc,
          price: product.price,
          image: product.image,
          galleryImages: galleryImages, 
          product: product ,
          user: req.user,
        });
      });
    } else {
      // Gallery directory does not exist, handle accordingly
      // For example, set a default value for galleryImages or display a message to the user
      const galleryImages = [];
      res.render('admin/edit_product', {
        title: product.title,
        errors: errors,
        desc: product.desc,
        price: product.price,
        image: product.image,
        galleryImages: galleryImages, 
        product: product ,
        user: req.user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Post edit-product
router.post('/edit-product/:id',isAdmin, upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, desc, price } = req.body;

    // Find the product by its _id
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      req.flash('danger', 'Product not found.');
      return res.redirect('/admin/products');
    }

    // Check if a new image is uploaded
    if (req.file) {
      // Delete the existing image if it exists
      if (product.image) {
        const imagePath = path.join('public/product_images', productId, product.image);
        fs.unlinkSync(imagePath);
      }

      // Set the new image file name
      product.image = req.file.filename;

      // Move the uploaded image to the destination directory
      const destinationDir = path.join('public/product_images', productId);
      await mkdirp(destinationDir);
      fs.renameSync(req.file.path, path.join(destinationDir, req.file.filename));
    }

    // Update the product fields
    product.title = title;
    product.slug= title.toLowerCase();
    product.desc = desc;
    product.price = price;

    // Save the updated product
    await product.save();

    req.flash('success', 'Product updated successfully.');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    req.flash('danger', 'Error updating product.');
    res.redirect('/admin/products');
  }
});

// POST route to handle updating the product gallery
router.post('/edit-product/:id/gallery',isAdmin, uploadGallery.array('gallery', 5), async (req, res) => {
  try {
    const productId = req.params.id;
    const images = req.files; // Array of uploaded files

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found.');
    }

    // Check if there are uploaded images
    if (!images || images.length === 0) {
      req.flash('danger','No image uploaded');
      return res.redirect('/admin/products//edit-product/' + productId)
    }

    // Save the filenames to the database
    images.forEach(async (image) => {
      const newGalleryImage = {
        filename: image.filename
      };
      product.galleryImages.push(newGalleryImage);
    });

    // Save the updated product with gallery images
    await product.save();
    return res.redirect('/admin/products//edit-product/' + productId)
   } catch (error) {
    console.error('Error uploading gallery images:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to delete an image
router.post('/delete-image/:productId/:imageId',isAdmin, async (req, res) => {
  const { productId, imageId } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the image to be deleted
    const image = product.galleryImages.find(img => img._id.toString() === imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Get the filename of the image
    const filename = image.filename;

    // Remove the image from the product's galleryImages array
    product.galleryImages = product.galleryImages.filter(img => img._id.toString() !== imageId);

    // Save the updated product
    await product.save();

    // Construct the path to the image file
    const imagePath = path.join(__dirname, '..', 'public', 'product_images', productId, 'gallery', filename);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(imagePath)) {
      // Delete the image file
      fs.unlinkSync(imagePath);
      console.log('Image file deleted:', imagePath); // Log success message
    } else {
      console.log('Image file not found:', imagePath); // Log file not found
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Delete Product and Associated Images
router.get('/delete-product/:id',isAdmin, async function(req, res) {
  try {
    const productId = req.params.id;

    // Find the product by its ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }

    // Retrieve the image file name
    const imageName = product.image;

    // Retrieve the gallery images
    const galleryImages = product.galleryImages;

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    // If the product had an associated image
    if (imageName) {
      // Construct the path to the image directory
      const imageDir = path.join('public/product_images', productId);

      // Check if the image directory exists before attempting to delete
      if (fs.existsSync(imageDir)) {
        // Delete the image file and its directory
        await fs.promises.rm(imageDir, { recursive: true });
      }
    }

    // Delete associated gallery images and their directories
    await Promise.all(galleryImages.map(async (image) => {
      const imageDir = path.join('public/product_images', productId, 'gallery', image.filename);
      // Check if the image directory exists before attempting to delete
      if (fs.existsSync(imageDir)) {
        await fs.promises.rm(imageDir, { recursive: true });
      }
    }));

    req.flash('success', 'Product and associated images deleted');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to delete product and associated images');
    res.redirect('/admin/products');
  }
});

module.exports = router;
