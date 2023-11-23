const express = require('express')
const router = express.Router()



const {ipScoring, question_controller} = require('../controllers/IPScoring')

router.post('/get-score/:id', ipScoring)
router.get('/questions', question_controller)
module.exports = router