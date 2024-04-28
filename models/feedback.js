const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true
  }
});

const Image = mongoose.model('FeedbackImage', imageSchema);

module.exports = Image;
