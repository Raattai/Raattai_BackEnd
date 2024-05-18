var mongoose = require('mongoose');



var orderSchema = mongoose.Schema({

           
    amount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    }
    
});

var Order = module.exports = mongoose.model('Order', orderSchema);
