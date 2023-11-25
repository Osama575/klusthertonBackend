const express = require('express')
const router = express.Router()



const {editUser, getUser, getUsersArray} = require('../controllers/user')

router.patch('/editUser/:id', editUser)
router.get('/:id', getUser)
router.get('/array/users', getUsersArray)

module.exports = router