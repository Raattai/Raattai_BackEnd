var mongoose = require('mongoose');

// // userSchema
// var TxnSchema = mongoose.Schema({

//     paymentOption: {
//         type: String,
//         required: true
//     },
//     txnId: {
//         type: String,
//         required: true
//     },
//     merchantId: {
//         type: String,
//         required: true
//     },
//     amount: {
//         type: String,
//         required: true
//     },
//     refNo: {
//         type: String,
//         required: true
//     },
//     currency: {
//         type: Number
//     }
    
// });

var transactionSchema = mongoose.Schema({

    
    txnId: {
        type: String,
        required: true
    },    
    amount: {
        type: Number,
        required: true
    },
    orderId: {
        type: String,
        required: true
    }
    
});

var Transaction = module.exports = mongoose.model('Transaction', transactionSchema);
