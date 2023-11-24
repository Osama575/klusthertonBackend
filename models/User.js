const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure environment variables are properly loaded

// Define Personal Info schema
const PersonalInfoSchema = new mongoose.Schema({
    _id: false,
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
        minlength: [2, 'Name too short'],
        maxlength: [50, 'Name too long'], // Corrected from maxLength to maxlength
        lowercase: true,
    },
    lastName: {
        type: String,
        maxlength: [50, 'Name too long'], // Corrected from maxLength to maxlength
        lowercase: true,
    },
    password: {
        type: String,
        required: false, // Make the password field optional
        minlength: [3, 'Password must be at least 3 characters']
    },
    email: {
        type: String,
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
    country: String,
    state: String,
    dateOfBirth: String,
    gender: String,
});

const ChatSchema = new mongoose.Schema({
    _id: false,
    sid: String,
});

const LearningInfoSchema = new mongoose.Schema({
    _id: false,
    preference: String,
    goals: String,
    experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    styles: {
        type: String,
        enum: ['visual', 'auditory', 'kinesthetic']
    }
});

const AnalysisSchema = new mongoose.Schema({
    language: String
});

const CourseSchema = new mongoose.Schema({
    progress: String,
});

// Define User schema
const UserSchema = new mongoose.Schema({
    data: {
        type: PersonalInfoSchema,
    },
    demographics: {
        type: DemographicsSchema,
    },
    chat: {
        type: ChatSchema
    },
    learningInfo: {
        type: LearningInfoSchema
    },
    analysis: {
        type: AnalysisSchema
    },
    courseInfo: {
        type: CourseSchema
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
        type: String
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
    console.log("isMatch:", isMatch);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);
