const { StreamChat } = require('stream-chat');
const shortid = require('shortid');
const User = require('././models/User');
const connectDB = require('./db/connectdb');

require('dotenv').config();

const apiKey = process.env.STREAM_KEY;
const apiSecret = process.env.STREAM_SECRET;

const chatClient = StreamChat.getInstance(apiKey, apiSecret);

async function createGroupChat(courseId, users) {
    try {
        // Connect to the database
        await connectDB(process.env.MONGO_URL);

        // Create or ensure users exist in Stream Chat
        for (const userId of users) {
            await chatClient.upsertUser({ id: userId });
        }

        const groupId = shortid.generate();

        const channel = chatClient.channel('messaging', groupId, {
            created_by_id: 'system', // Your server-side user ID
            members: users.map(user => user.userId),
            name: `Group${groupId}`,
        });

        await channel.create();

        for (const { userId } of users) {
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

module.exports = createGroupChat;
