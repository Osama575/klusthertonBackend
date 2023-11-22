const express = require('express')
const router = express.Router()



const {editUser} = require('../controllers/user')

router.post('/edit', editUser)

module.exports = router