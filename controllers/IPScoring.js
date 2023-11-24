'use strict';
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')
var IqScoring = require('../iq-personality/scoring');
var questions = require('../questions/question')


const ipScoring = async ( req, res, next) => {
    
    const userid = req.params.id;
    const {question_1, question_2, question_3, question_4, question_5, question_6, question_7, 
        question_8, question_9,} = req.body;

        try {
            const iq_scoring = new IqScoring(
                userid, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8,
             question_9);
            
            const data = iq_scoring.score_detail();    

            let changes = {
                scoringResult: {iqScore:data.iqScore, personalityScore:data.personalityScore}};

            // Store users score
            const result = await User.updateOne(
                { _id: userid },
                { $set: changes }, // Use $set to update the specified fields
                { runValidators: true }
            );
        
            if (result.nModified === 0) {
                throw new NotFoundError("Error making changes")};
            
                res.status(StatusCodes.OK).json({error:false, msg:'successful', data:data})
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({error:true, msg: error.message })
        };
};


const question_controller = async (req, res, next) => {
    try {
        res.status(StatusCodes.OK).json({error:false, msg:'successful', data:questions})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error:true, msg: error.message })
    }
};


module.exports = {ipScoring, question_controller};