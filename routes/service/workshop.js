var express = require('express');
var router = express.Router();
var Workshop = require('../../models/service/workshop.js');
const authenticate = require('../../utils/AuthDecode.js');
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

router.post('/workshop', async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const selectedWorkshop = availableWorkshopData.find(workshop => {
            console.log('Checking workshop:', workshop);
            console.log('Workshop Industry:', workshop.Industry, 'Request Industry:', req.body.Industry);
            console.log('Workshop NoOfPeople:', workshop.NoOfPeople, 'Request NoOfPeople:', req.body.NoOfPeople);
            console.log('Workshop Date:', new Date(workshop.Date).toISOString(), 'Request Date:', new Date(req.body.Date).toISOString());

            return (
                workshop.Industry === req.body.Industry &&
                workshop.NoOfPeople > req.body.NoOfPeople &&
                new Date(workshop.Date).toISOString() === new Date(req.body.Date).toISOString()
            );
        });

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
            
        });

        const savedWorkshop = await workshopData.save();
        res.status(201).json({ data: savedWorkshop, message: "success" });
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

module.exports = router;
