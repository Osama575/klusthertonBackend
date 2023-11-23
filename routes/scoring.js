const express = require('express')
const router = express.Router()



const {ipScoring} = require('../controllers/IPScoring')

router.post('/scoring', ipScoring)

module.exports = router