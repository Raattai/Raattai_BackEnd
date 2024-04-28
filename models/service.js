const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  img: {
    type: String, 
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
