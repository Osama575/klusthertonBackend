const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videos: [{
        videoTitle: String,
        videoLink: String
    }]
}, { _id: false }); // Disable the _id field for each module

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    overview: {
        type: String
    },
    tutor: {
        type: String
    },
    registeredStudents: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    modules: [ModuleSchema], // Array of modules
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Course', CourseSchema);
