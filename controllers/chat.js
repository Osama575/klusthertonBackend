const {createGroupChat, addUsersToGroupChat} = require('../chat');
const { StreamChat } = require('stream-chat');
const User = require('../models/User')
const axios = require('axios')

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

        // Check if courseId and userIds are provided and userIds is an array
        if (!courseId || !userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ message: 'courseId and userIds are required and userIds must be an array' });
        }

        // Ensure that userIds are strings
        if (userIds.some(userId => typeof userId !== 'string')) {
            return res.status(400).json({ message: 'All userIds must be strings' });
        }

        const groupId = await createGroupChat(courseId, userIds);
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
            return res.status(200).json({ message: 'No group found for the specified course' });
        }

        const group = user.chat.groups.find(group => group.courseId.toString() === courseId);

        // if (!group) {
        //     return res.status(200).json({ message: 'No courseId found for the specified course' });
        // }

        res.status(200).json({ groupId: group.groupId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving group', error: error.message });
    }
};

const addUsersToGroupController = async (req, res) => {
    try {
        // Extract groupId and userIds from the request body
        const { groupId, userIds, courseId } = req.body;

        // Validate input
        if (!groupId || !userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Call the addUsersToGroupChat method
        await addUsersToGroupChat(groupId, userIds, courseId);

        // Send success response
        res.status(200).json({ message: "Users added to group chat successfully" });
    } catch (error) {
        console.error('Error in addUsersToGroupController:', error);
        res.status(500).json({ message: "Error adding users to group chat", error: error.message });
    }
};

const model = async(req, res) => {
    const {user_id, course_id} = req.body
    const url_for = 'model_service'

    const body = {
        url_for: url_for,
        user_id: user_id,
        course_id: course_id
    }
    
    const url = 'https://bcxafrkyjxv2swwjzm6lu5afui0ylfdw.lambda-url.eu-west-1.on.aws/'
    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
    
        const data = await response.json();
        res.status(200).json({data});
      } catch (error) {
        
        throw error;
      }
    }




module.exports = {
    createGroupChatWithParticipants,
    generateChatToken,
    getUserGroupByCourse,
    addUsersToGroupController,
    model
}