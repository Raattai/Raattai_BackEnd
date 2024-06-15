var mongoose = require('mongoose');



// product schema
var deliveryAddressSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },   
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,        
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalcode: {
        type: String,
        required: true
    },
});

var DeliveryAddress = module.exports = mongoose.model('DeliveryAddress', deliveryAddressSchema);
