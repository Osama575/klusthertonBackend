const { StreamChat } = require('stream-chat');
const shortid = require('shortid');
const User = require('../Ravetech_Api/models/User');
const connectDB = require('./db/connectdb')

require('dotenv').config()

const apiKey = process.env.STREAM_KEY;
const apiSecret = process.env.STREAM_SECRET;

const chatClient = StreamChat.getInstance(apiKey, apiSecret);

async function createGroupChat(users) {
  try {
    // Create or ensure users exist in Stream Chat
    for (const userId of users) {
      await chatClient.upsertUser({ id: userId });
    }

    const groupId = shortid.generate();

    const channel = chatClient.channel('messaging', groupId, {
      created_by_id: 'system', // Your server-side user ID
      members: users,
      name: `Group${groupId}`,
    });

    await channel.create();

    await connectDB(process.env.MONGO_URL)

    for (const userId of users) {
     const updateResult = await User.updateOne({ _id: userId }, {'chat.groupId': groupId });

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

const users = ['6550d8cd5216cf345c6e5af9', '6550dd1c5861bd41a42eee8c', '6553dfb09b431e2334a0589e']; // Example of the userID passed in tthe callBack

createGroupChat(users)
  .then((groupId) => {
    console.log('Associated group ID:', groupId);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

module.exports = createGroupChat;
