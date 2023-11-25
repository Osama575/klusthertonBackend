const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authenticateUser')

const {editUser, getUser, getUserByGroupCourse, usersArray} = require('../controllers/user')

router.patch('/editUser/:id', editUser)
router.get('/:id', authenticateUser, getUser)
router.get('/course/user', getUserByGroupCourse)
router.get('/array/users', usersArray)

module.exports = router