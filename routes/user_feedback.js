const express = require('express');
const router = express.Router();
const Image = require('../models/feedback');
var auth = require('../config/auth.js');
var isUser = auth.isUser;

// Create a new image
router.post('/image', async (req, res) => {
  try {
    const { imgUrl } = req.body;
    const newImage = new Image({ imgUrl });
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all images
router.get('/image', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing image
router.put('/image/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { imgUrl } = req.body;
      const updatedImage = await Image.findByIdAndUpdate(id, { imgUrl }, { new: true });
      if (!updatedImage) {
        return res.status(404).json({ message: 'Image not found' });
      }
      res.json(updatedImage);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete an image
  router.delete('/image/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedImage = await Image.findByIdAndDelete(id);
      if (!deletedImage) {
        return res.status(404).json({ message: 'Image not found' });
      }
      res.json({ message: 'Image deleted' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


module.exports = router;