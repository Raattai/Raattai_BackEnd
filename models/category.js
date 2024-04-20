// models/category.js

const mongoose = require('mongoose');

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

// Create and export Category model
module.exports = mongoose.model('Category', categorySchema);
