var mongoose = require('mongoose');

// Blog schema
var BlogSchema = mongoose.Schema({

    BlogTitle: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    addition_info: {
        type: Number
    },
    image: {
        type: String,
        required: true
    }
    
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;