const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authenticateUser')

const {editUser, getUser, getUserByGroupCourse} = require('../controllers/user')

router.patch('/editUser/:id', editUser)
router.get('/:id', authenticateUser, getUser)
router.get('/course/user', getUserByGroupCourse)

module.exports = router