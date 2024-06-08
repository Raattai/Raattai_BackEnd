const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    contactnumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\+?[0-9\s-]+$/.test(v);
            },
            message: props => `${props.value} is not a valid contact number!`
        }
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true 
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
