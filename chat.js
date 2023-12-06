const { StreamChat } = require('stream-chat');
const shortid = require('shortid');
const User = require('././models/User');
const Course = require('././models/Course');
const connectDB = require('./db/connectdb');
const sendMail = require('./mailer/mail')


require('dotenv').config();

const apiKey = process.env.STREAM_KEY;
const apiSecret = process.env.STREAM_SECRET;

const chatClient = StreamChat.getInstance(apiKey, apiSecret);

async function createGroupChat(courseId, userIds) {
    try {
        // Connect to the database
        await connectDB(process.env.MONGO_URL);

        // Create or ensure users exist in Stream Chat
        for (const userId of userIds) {
            await chatClient.upsertUser({ id: userId });
        }

        const groupId = shortid.generate();

         // Find the course in the database
         const course = await Course.findById(courseId);
         if (!course) {
             throw new Error('Course not found');
         }

         // Generate a unique group chat name
        const randomNumber = Math.floor(Math.random() * 100); // Two-digit random number
        const groupName = `${course.name}-${randomNumber}`;

 

        // Create a new channel
        const channel = chatClient.channel('messaging', groupId, {
            created_by_id: 'system', // Replace with your server-side user ID
            members: userIds,
            name: groupName,
        });

        await channel.create();

        // Update users with the new group chat information
        for (const userId of userIds) {
            const updateResult = await User.updateOne(
                { _id: userId },
                { $addToSet: { 'chat.groups': { courseId, groupId } } }
            );

            // Check if the user was updated
            if (updateResult.modifiedCount === 0) {
                throw new Error(`User with ID ${userId} was not updated`);
            }
        }

        console.log('Group chat created successfully!');
        return groupId;
    } catch (error) {
        console.error('Error creating group chat:', error);
        throw error;
    }
}

async function addUsersToGroupChat(groupId, users, courseId) {
    try {
        // Connect to the database
        await connectDB(process.env.MONGO_URL);

        // Fetch the channel using the groupId
        const channel = chatClient.channel('messaging', groupId);

        // Ensure the channel exists
        const state = await channel.watch();
        if (!state) {
            throw new Error(`Group with ID ${groupId} does not exist`);
        }

        for (const userId of users) {
            // Create or ensure the user exists in Stream Chat
            await chatClient.upsertUser({ id: userId });

            // Check if user is already in the group
            const user = await User.findOne({ _id: userId, 'chat.groups': { $elemMatch: { groupId } } });

            if (!user) {
                // User not in group, add to group chat in Stream Chat
                await channel.addMembers([userId]);

                // Update user's document in the database
                const updateResult = await User.updateOne(
                    { _id: userId },
                    { $addToSet: { 'chat.groups': { courseId, groupId } } }
                );

                // Check if the user was updated
                if (updateResult.modifiedCount === 0) {
                    throw new Error(`User with ID ${userId} was not updated`);
                }
            }
        }

        

        console.log(`Users added to group chat with ID ${groupId} successfully!`);
    } catch (error) {
        console.error('Error adding users to group chat:', error);
        throw error;
    }
}


module.exports = {
    createGroupChat,
    addUsersToGroupChat
};



