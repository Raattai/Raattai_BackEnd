var express = require('express');
var router = express.Router();
var Workshop = require('../../models/service/workshop.js');
const authenticate = require('../utils/AuthDecode.js');

// Predefined data options (simulated as backend data)
const availableWorkshopData = [
    {
        Industry: "Technology",
        NoOfPeople: 50,
        Date: new Date("2023-06-01")
    },
    {
        Industry: "Healthcare",
        NoOfPeople: 30,
        Date: new Date("2023-07-01")
    },
    {
        Industry: "Finance",
        NoOfPeople: 40,
        Date: new Date("2023-08-01")
    }
];

// GET route to send available workshop data to the client
router.get('/workshop-data',authenticate, (req, res) => {
    res.status(200).json(availableWorkshopData);
});

// POST route to save workshop data
router.post('/workshop',authenticate, async (req, res) => {
    try {
        const selectedWorkshop = availableWorkshopData.find(workshop => 
            workshop.Industry === req.body.Industry &&
            workshop.NoOfPeople > req.body.NoOfPeople &&
            new Date(workshop.Date).toISOString() === new Date(req.body.Date).toISOString()
        );

        if (!selectedWorkshop) {
            return res.status(400).send('Invalid workshop selection.');
        }

        const workshopData = new Workshop({
            Industry: selectedWorkshop.Industry,
            NoOfPeople: selectedWorkshop.NoOfPeople, 
            Date: selectedWorkshop.Date, 
            PersonToConnect: req.body.PersonToConnect,
            Email: req.body.Email,
            ContactNumber: req.body.ContactNumber,
            Address: req.body.Address,
            user: req.userId
        });

        const savedWorkshop = await workshopData.save();
        res.status(201).send(savedWorkshop);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
