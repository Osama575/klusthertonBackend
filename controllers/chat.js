const createGroupChat = require('../chat');
const { StreamChat } = require('stream-chat');
const User = require('../models/User')

// Initialize Stream Chat client
const chatClient = StreamChat.getInstance(process.env.STREAM_KEY, process.env.STREAM_SECRET);

const generateChatToken = async (req, res) => {
    try {
        const userId = req.params.id; // extract pass the user ID as a URL parameter

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const token = chatClient.createToken(userId);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating chat token:', error);
        res.status(500).json({ message: "Error generating chat token", error: error.message });
    }
};

const createGroupChatWithParticipants = async (req, res) => {
    try {
        // Expecting an object in the request body with courseId and an array of userIds
        const { courseId, userIds } = req.body; 

        // Check if courseId and userIds are provided
        if (!courseId || !userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ message: 'courseId and userIds are required' });
        }

        const groupId = await createGroupChat(courseId, userIds.map(userId => ({ userId })));
        res.status(200).json({ message: 'Group chat created successfully', groupId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating group chat', error: error.message });
    }
}

const getUserGroupByCourse =   async (req, res) => {
    try {
        const userId = req.user.userid; // Get user ID from authenticated user
        const { courseId } = req.body; // Extract courseId from request body

        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }

        const user = await User.findOne({ _id: userId, 'chat.groups.courseId': courseId });

        if (!user) {
            return res.status(404).json({ message: 'No group found for the specified course' });
        }

        const group = user.chat.groups.find(group => group.courseId.toString() === courseId);

        if (!group) {
            return res.status(404).json({ message: 'No group found for the specified course' });
        }

        res.status(200).json({ groupId: group.groupId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving group', error: error.message });
    }
};

module.exports = {
    createGroupChatWithParticipants,
    generateChatToken,
    getUserGroupByCourse
}