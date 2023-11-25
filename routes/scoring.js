const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authenticateUser')

const {ipScoring, question_controller} = require('../controllers/IPScoring')

router.post('/get-score/:id', authenticateUser, ipScoring)
router.get('/questions', question_controller)
module.exports = router