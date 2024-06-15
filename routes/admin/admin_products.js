var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);
var auth = require('../../config/auth');
var isAdmin = auth.isAdmin;

// Get product model
var Product = require('../../models/product.js'); 
var Category = require('../../models/category.js'); 
const uploadGallery = require('../../utils/gallery');
var Stock = require('../../models/stock.js'); 


router.get('/', async (req, res) => {
    try {
        const count = await Product.countDocuments({});
        const products = await Product.find({}).exec();
        res.json({ products, count });
    } catch (error) {
        console.error('Error counting products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {  
   
    cb(null, 'web/assets/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: function(req, file, cb) {
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

router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const { title, desc, price, category } = req.body;
    
    const image = req.file ? '/assets/img/' + req.file.filename : '';
  

    // Check if any required field is missing
    if (!title || !desc || !price || !category || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new product instance
    const newProduct = new Product({
      title: title,
      slug: title.toLowerCase(),
      desc: desc,
      price: price,
      image: image,
      category: category 
    });

    // Save the product to the database
    await newProduct.save();

    const stock = new Stock({
      items: [{ product: newProduct._id, quantity: 10 }]
    });

    await stock.save();

    // Create directories for product images
    const productId = newProduct._id;
    console.log('productid',productId);
    await mkdirp('web/assets/img/' + productId + '/gallery', { recursive: true });
    await mkdirp('web/assets/img/' + productId + '/gallery/thumbs', { recursive: true });

    // Move uploaded image to the appropriate directory
    if (image !== "") {
      const imagePath = 'web/assets/img/' + productId + '/' + image;

      // Move the image file
      if (fs.existsSync(req.file.path)) {
        fs.rename(req.file.path, imagePath, err => {
          if (err) {
            console.error('Error moving image:', err);
            return res.status(500).json({ error: 'Error moving image' });
          } else {
            console.log('Image moved successfully:', req.file.path, '->', imagePath);
            return res.status(201).json({ message: 'Product added successfully' });
          }
        });
      } else {
        console.error('Source file does not exist:', req.file.path);
        return res.status(500).json({ error: 'Source file does not exist' });
      }
    } else {
      return res.status(201).json({ message: 'Product added successfully' });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/edit-product/:_id', async function(req, res) {
  try {
    const productId = req.params._id;

    // Find product and categories asynchronously
    const [product, categories] = await Promise.all([
      Product.findOne({ _id: productId }),
      Category.find()
    ]);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const galleryDir = 'web/assets/img/' + product._id + '/gallery';
    
    // Read the directory asynchronously
    fs.readdir(galleryDir, function(err, files){
      if(err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      } 
      
      // If no error, send JSON response
      const galleryImages = files;
      res.status(200).json({
        title: product.title,
        errors: null, // Errors are not relevant for JSON response
        desc: product.desc,
        categories: categories,
        category: product.category.replace(/\s+/g , '-').toLowerCase(),
        price: product.price,
        image: product.image,
        galleryImages: galleryImages, 
        product: product 
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/edit-product/:id', upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, desc, price, category } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if a new image is uploaded
    if (req.file) {
      if (product.image) {
        const imagePath = path.join('web/assets/img', productId, product.image);
        fs.unlinkSync(imagePath);
      }
      product.image = req.file.filename;
      const destinationDir = path.join('web/assets/img', productId);
      await mkdirp(destinationDir);
      fs.renameSync(req.file.path, path.join(destinationDir, req.file.filename));
    }

    // Update the product fields
    product.title = title;
    product.slug = title.toLowerCase();
    product.desc = desc;
    product.price = price;
    product.category = category;

    // Save the updated product
    await product.save();

    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/edit-product/:id/gallery', uploadGallery.array('gallery', 5), async (req, res) => {
  try {
    const productId = req.params.id;
    const images = req.files;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    images.forEach(async (image) => {
      const newGalleryImage = {
        filename: `/assets/img/${productId}/gallery/` + image.filename
      };
      product.galleryImages.push(newGalleryImage);
    });
    await product.save();

    return res.status(200).json({ message: 'Gallery images uploaded successfully' });
  } catch (error) {
    console.error('Error uploading gallery images:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/delete-image/:productId/:imageId', async (req, res) => {
  const { productId, imageId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const image = product.galleryImages.find(img => img._id.toString() === imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const filename = image.filename;
    product.galleryImages = product.galleryImages.filter(img => img._id.toString() !== imageId);
    await product.save();
    const imagePath = path.join(__dirname, '..', 'web', 'assets','img', productId, 'gallery', filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('Image file deleted:', imagePath); 
    } else {
      console.log('Image file not found:', imagePath); 
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Delete Product and Associated Images
router.get('/delete-product/:id', async function(req, res) {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }

    const imageName = product.image;

    const galleryImages = product.galleryImages;

    await Product.findByIdAndDelete(productId);

    if (imageName) {
      const imageDir = path.join('web/assets/img', productId);
      if (fs.existsSync(imageDir)) {
        await fs.promises.rm(imageDir, { recursive: true });
      }
    }
    await Promise.all(galleryImages.map(async (image) => {
      const imageDir = path.join('web/assets/img', productId, 'gallery', image.filename);
      if (fs.existsSync(imageDir)) {
        await fs.promises.rm(imageDir, { recursive: true });
      }
    }));

    req.send('success', 'Product and associated images deleted');
   
  } catch (error) {
    console.error(error);
    req.send('error', 'Failed to delete product and associated images');
   
  }
});

module.exports = router;
