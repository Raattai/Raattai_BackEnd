const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, required: true }
        }
    ]
});

module.exports = mongoose.model('Stock', stockSchema);
