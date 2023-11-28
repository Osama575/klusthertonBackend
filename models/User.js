const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Course = require('./Course')

require('dotenv').config(); // Ensure environment variables are properly loaded

// Define Personal Info schema
const PersonalInfoSchema = new mongoose.Schema({
    _id: false,
    firstName: {
        type: String,
        default: '',
        required: [true, 'Please provide your first name'],
        minlength: [2, 'Name too short'],
        maxlength: [50, 'Name too long'],
        lowercase: true,
    },
    lastName: {
        type: String,
        default: '',
        maxlength: [50, 'Name too long'],
        lowercase: true,
    },
    password: {
        type: String,
        required: false,
        minlength: [3, 'Password must be at least 3 characters']
    },
    email: {
        type: String,
        default: '',
        required: [true, 'Please provide your email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Define Demographics schema
const DemographicsSchema = new mongoose.Schema({
    _id: false,
    country: { type: String, default: '' },
    state: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    gender: { type: String, default: '' },
});

const ChatSchema = new mongoose.Schema({
    _id: false,
    groups: [{
        courseId: {
            type: String,
            ref: 'Course',
            default: null
        },
        groupId: {
            type: String,
            default: ''
        }
    }]
});

const LearningInfoSchema = new mongoose.Schema({
    _id: false,
    preference: { type: String, default: '' },
    goals: { type: String, default: '' },
    experience: { type: String, default: '' },
    styles: { type: String, default: '' },
    onBoarded: { type: Boolean, default: false }
});

const AnalysisSchema = new mongoose.Schema({
    language: { type: String, default: '' }
});

// Define User schema
const UserSchema = new mongoose.Schema({
    data: {
        type: PersonalInfoSchema,
    },
    demographics: {
        type: DemographicsSchema, default: {}
    },
    chat: {
        type: ChatSchema, default: {}
    },
    learningInfo: {
        type: LearningInfoSchema
    },
    analysis: {
        type: AnalysisSchema
    },
    courseInfo: {
        type: Array, default: []
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    scoringResult: {
        type: Map
    },
    age: {
        type: String, default: ''
    },
});

// Define a method for hashing the password
UserSchema.methods.hashPassword = async function () {
    if (this.data && this.data.password) {
        const saltRounds = 10;
        this.data.password = await bcrypt.hash(this.data.password, saltRounds);
    }
};

UserSchema.pre('save', async function (next) {
    try {
        if (this.isModified('data.password') || this.isNew) {
            if (this.data && this.data.password) {
                await this.hashPassword();
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userid: this._id,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        createdAt: this.data.createdAt,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};

UserSchema.methods.comparePassword = async function (loginPassword) {
    const isMatch = await bcrypt.compare(loginPassword, this.data.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);
