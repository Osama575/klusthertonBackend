const express = require('express')
const router = express.Router()



const {ipScoring} = require('../controllers/IPScoring')

router.post('/get-score/:id', ipScoring)

module.exports = router