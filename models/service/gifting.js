var mongoose = require('mongoose');

var GiftingSchema = new mongoose.Schema({
    NoOfGifts: {
        type: Number,
        required: true
    },
    NoOfLooms: {
        type: Number,
        required: true
    },
    PersonToConnect: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    ContactNumber: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

var Gifting = mongoose.model('Gifting', GiftingSchema); 

module.exports = Gifting;
