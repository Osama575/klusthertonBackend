const express = require('express')
const router = express.Router()


const authenticateUser = require('../middleware/authenticateUser')


const {createGroupChatWithParticipants, generateChatToken, getUserGroupByCourse} = require('../controllers/chat')

router.post('/:id', createGroupChatWithParticipants)
router.get('/user/:id', authenticateUser, generateChatToken)
router.post('/groups/getUserGroup', authenticateUser, getUserGroupByCourse)

module.exports = router