const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authenticateUser')

const {editUser, getUser, getUsersArray} = require('../controllers/user')

router.patch('/editUser/:id', authenticateUser, editUser)
router.get('/:id', authenticateUser, getUser)
router.get('/array/users', getUsersArray)

module.exports = router