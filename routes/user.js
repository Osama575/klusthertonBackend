const express = require('express')
const router = express.Router()



const {editUser, getUser} = require('../controllers/user')

router.patch('/editUser/:id', editUser)
router.get('/:id', getUser)


module.exports = router