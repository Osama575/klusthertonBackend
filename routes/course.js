const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authenticateUser')

const {createNewCourse, getAllCourses, getSingleCourse, joinCourse} = require('../controllers/course')

router.route('/').post(createNewCourse).get(getAllCourses).patch(authenticateUser, joinCourse)
router.get('/single/:id', getSingleCourse)


module.exports = router