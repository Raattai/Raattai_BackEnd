var mongoose = require('mongoose');

var WorkshopSchema = new mongoose.Schema({
    Industry: {
        type: String,
        required: true
    },
    NoOfPeople: {
        type: Number,
        required: true
    },
    Date: {
        type: Date,
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

var Workshop = mongoose.model('Workshop', WorkshopSchema);

module.exports = Workshop;
