const express = require('express');
const router = express.Router();
const Contact = require('../models/ContactUs.js');
// const authenticate = require('../utils/AuthDecode.js');
const mailer = require('../utils/mailer.js');

router.post('/contact', async (req, res) => {
    try {
        const contactData = new Contact({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            subject: req.body.subject,
            contactnumber: req.body.contactnumber,
            message: req.body.message
        });

        const savedContact = await contactData.save();
        const sub = `New Contact Request from ${req.body.firstname} ${req.body.lastname}: ${req.body.subject}`;
        await mailer('raataitech@gmail.com', 'Query', sub);

        res.status(201).send({ message: "you will receive email" });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
