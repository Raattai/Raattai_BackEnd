var express = require('express');
var router = express.Router();
var Gifting = require('../../models/service/gifting.js');
const authenticate = require('../../utils/AuthDecode.js');

router.post('/gifting', async (req, res) => {
    try {
        const giftingData = new Gifting({
            NoOfGifts: req.body.NoOfGifts,
            NoOfLooms: req.body.NoOfLooms,
            PersonToConnect: req.body.PersonToConnect,
            Email: req.body.Email,
            ContactNumber: req.body.ContactNumber,
            Address: req.body.Address,
          
        });

        const savedGifting = await giftingData.save();
        res.status(201).send({data : savedGifting, message : "success"});
    } catch (error) {
        res.status(400).send(error.message);
    }
});
module.exports = router;

