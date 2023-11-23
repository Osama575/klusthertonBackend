
// scoring.js
'use strict';
const {NotFoundError, BadRequestError} = require('../errors')
const User = require('../models/User')

module.exports = class IqScoring {
    constructor ( 
        userid, question_1, question_2, question_3, question_4, question_5, question_6, question_7, 
        question_8, question_9, question_10) {
        this.userid = userid; // Store the userid
        this.question_1 = question_1;
        this.question_2 = question_2;
        this.question_3 = question_3;
        this.question_4 = question_4;
        this.question_5 = question_5;
        this.question_6 = question_6;
        this.question_7 = question_7;
        this.question_8 = question_8;
        this.question_9 = question_9;
        this.question_10 = question_10;
        this.extraversion_score = 0;
        this.openness_score = 0;
        this.conscientiousness = 0;
        this.agreeableness = 0;
        this.neuroticism = 0;
        this.iq_score = 0;
    }

     process_question_1 () {
        if (this.question_1=="option_1") {
            this.extraversion_score += 1;
        };

        if (this.question_1=="option_2") {
            this.openness_score += 1;
        };

        if (this.question_1=="option_3") {
            this.conscientiousness += 1;
        };

        if (this.question_1=="option_4") {
            this.agreeableness += 1;
        };

        if (this.question_1=="option_5") {
            this.neuroticism += 1;
        };
    }

    process_question_7 () {
        if (this.question_7=="option_1") {
            this.iq_score += 2;
        };
    };


    process_question_2 () {
        if (this.question_2=="option_1") {
            this.extraversion_score += 1;
        };

        if (this.question_2=="option_2") {
            this.openness_score += 1;
        };

        if (this.question_2=="option_3") {
            this.conscientiousness += 1;
        };

        if (this.question_2=="option_4") {
            this.agreeableness += 1;
        };

        if (this.question_2=="option_5") {
            this.neuroticism += 1;
        };
    }

    process_question_3 () {
        if (this.question_3=="option_1") {
            this.extraversion_score += 1;
        };

        if (this.question_3=="option_2") {
            this.openness_score += 1;
        };

        if (this.question_3=="option_3") {
            this.conscientiousness += 1;
        };

        if (this.question_3=="option_4") {
            this.agreeableness += 1;
        };

        if (this.question_3=="option_5") {
            this.neuroticism += 1;
        };
    };

    process_question_4 () {
        if (this.question_4=="option_1") {
            this.extraversion_score += 1;
        };

        if (this.question_4=="option_2") {
            this.openness_score += 1;
        };

        if (this.question_4=="option_3") {
            this.conscientiousness += 1;
        };

        if (this.question_4=="option_4") {
            this.agreeableness += 1;
        };

        if (this.question_4=="option_5") {
            this.neuroticism += 1;
        };
    };

    process_question_5 () {
        if (this.question_5=="option_1") {
            this.extraversion_score += 1;
        };

        if (this.question_5=="option_2") {
            this.openness_score += 1;
        };

        if (this.question_5=="option_3") {
            this.conscientiousness += 1;
        };

        if (this.question_5=="option_4") {
            this.agreeableness += 1;
        };

        if (this.question_5=="option_5") {
            this.neuroticism += 1;
        };
    };

    async process_question_6 () {
        
        try {
            let user_checker = await User.findById({ _id: this.userid });
            if(user_checker.age) {
                throw new NotFoundError("Changes cant be made");
            }

            let changes = { age: this.question_6 };
            const result = await User.updateOne(
                { _id: this.userid },
                { $set: changes },
                { runValidators: true }
            );
            const here = {...changes}
            console.log(`RESSUUULLLTTT    ${this.userid}`)
            console.log(`RESSUUULLLTTT    ${here}`)

            if (result.nModified === 0) {
                throw new NotFoundError("Error making changes");
            }          
        } catch (error) {
            console.log(`HHHHHEEEEERRRRRRRRREEEEE   ${error}`);
            // throw new NotFoundError(error.message);
        }
    };

    process_question_7 () {
        if (this.question_7=="option_1") {
            this.iq_score += 2;
        };
    };

    process_question_8 () {
        if (this.question_8=="option_1") {
            this.iq_score += 2;
        };
    };

    process_question_9 () {
        if (this.question_9=="option_1") {
            this.iq_score += 2;
        };
    };

    process_question_10 () {
        if (this.question_10=="option_1") {
            this.iq_score += 2;
        };
    };

    process_question_11 () {

        if (this.question_11=="option_1") {
            this.iq_score += 2;
        };
    }

    score_detail() {
        this.process_question_1();
        this.process_question_2();
        this.process_question_3();
        this.process_question_4();
        this.process_question_5();
        this.process_question_6();
        this.process_question_7();
        this.process_question_8();
        this.process_question_9();
        this.process_question_10();
        this.process_question_11();

        var dict = {
            agreeableness:this.agreeableness, conscientiousness:this.conscientiousness, 
            extraversion:this.extraversion_score, neuroticism:this.neuroticism, 
            openness:this.openness_score,};

        const result = Object.entries(dict).reduce((a, dict) => a[1] > dict[1] ? a : dict)[0]

        // get maxVal

        return {iqScore:this.iq_score, personalityScore:result}
    };
};



// const iq_scoring = new IqScoring(
//     "option_1", "option_1", "option_1", "option_1", "option_1", "option_1", "option_1", 
//     "option_1", "option_1", "option_1", "option_1");

// console.log(iq_scoring.score_detail())