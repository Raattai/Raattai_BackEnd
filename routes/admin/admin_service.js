var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
var auth = require('../../config/auth');
var isAdmin = auth.isAdmin;
const Service = require('../models/service'); // Import the Category model

// Create a new service
router.post('/service', async (req, res) => {
    try {
      const { img, title, description } = req.body;
      const service = new Service({ img, title, description });
      const savedService = await service.save();
      res.status(201).json(savedService);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create service' });
    }
  });
  
 // Get all services
 router.get('/service', async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get services' });
    }
  });
  
  // Update a service
  router.put('/service/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { img, title, description } = req.body;
      const updatedService = await Service.findByIdAndUpdate(id, { img, title, description }, { new: true });
      if (!updatedService) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(updatedService);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update service' });
    }
  });
  
  // Delete a service
  router.delete('/service/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedService = await Service.findByIdAndDelete(id);
      if (!deletedService) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete service' });
    }
  });
  



  module.exports = router;