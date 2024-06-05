var mongoose = require('mongoose');

var CurriculumSchema = new mongoose.Schema({
    EducationalInstitution: {
        type: String,
        required: true
    },
    InstitutionName: {
        type: String,
        required: true
    },
    PersonToConnect: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    ContactNumber: {
        type: String,
        required: true
    },
    InstitutionAddress: {
        type: String,
        required: true
    },
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

var Curriculum = mongoose.model('Curriculum', CurriculumSchema); 

module.exports = Curriculum;
