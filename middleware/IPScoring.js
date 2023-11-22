'use strict';

var IqScoring = require('../iq-personality/scoring');


const ipScoring = async ( req, res, next) => {
    
    const userid = req.params.id;
    const {question_1, question_2, question_3, question_4, question_5, question_6, question_7, 
        question_8, question_9, question_10, question_11} = req.body;

        const iq_scoring = new IqScoring(
            question_1, question_2, question_3, question_4, question_5, question_6, question_7, 
        question_8, question_9, question_10, question_11);
        
        const data = iq_scoring.score_detail()

        try {
            // Store users score
            const result = await User.updateOne(
                { _id: userid },
                { $set: changes }, // Use $set to update the specified fields
                { runValidators: true }
            );
        
            if (result.nModified === 0) {
                throw new NotFoundError("Error making changes");
          }

        } catch (error) {
            
        }
        return data;

}
