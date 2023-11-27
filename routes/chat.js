const express = require('express')
const router = express.Router()


const authenticateUser = require('../middleware/authenticateUser')


const {createGroupChatWithParticipants, generateChatToken, getUserGroupByCourse, addUsersToGroupController, model} = require('../controllers/chat')

router.post('/group', createGroupChatWithParticipants)
router.get('/user/:id', authenticateUser, generateChatToken)
router.post('/groups/getUserGroup', authenticateUser, getUserGroupByCourse)
router.post('/groups/addUsers', addUsersToGroupController)
router.post('/model/createGroup', model)

module.exports = router