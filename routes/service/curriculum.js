var express = require('express');
var router = express.Router();
var Curriculum = require('../../models/service/curriculum.js');
const mailer = require('../../utils/mailer.js');
const authenticate = require('../../utils/AuthDecode.js');

router.post('/add', async (req, res) => {
    try {
        const curriculumData = new Curriculum({
            EducationalInstitution: req.body.EducationalInstitution,
            InstitutionName: req.body.InstitutionName,
            PersonToConnect: req.body.PersonToConnect,
            Email: req.body.Email,
            ContactNumber: req.body.ContactNumber,
            InstitutionAddress: req.body.InstitutionAddress,
        });

        const savedCurriculum = await curriculumData.save();
        res.status(201).send({data:savedCurriculum , message: "success"});
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message);
    }
});

module.exports = router;

