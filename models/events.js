var mongoose = require('mongoose');

// userSchema
var userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});

var User = module.exports = mongoose.model('User', userSchema);
