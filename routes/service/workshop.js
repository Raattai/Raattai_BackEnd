var express = require('express');
var router = express.Router();
var Workshop = require('../../models/service/workshop.js');
const authenticate = require('../../utils/AuthDecode.js');

router.post('/workshop', async (req, res) => {
    try {
        const workshopData = new Workshop({
            Industry: req.body.Industry,
            NoOfPeople: req.body.NoOfPeople,
            Date: req.body.Date,
            PersonToConnect: req.body.PersonToConnect,
            Email: req.body.Email,
            ContactNumber: req.body.ContactNumber,
            Address: req.body.Address,
        });
        const savedWorkshop = await workshopData.save();
        res.status(201).json({ data: savedWorkshop, message: "success" });
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

module.exports = router;
