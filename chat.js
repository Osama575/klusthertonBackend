const axios = require('axios');
const shortid = require('shortid');
const { StreamChat } = require('stream-chat');
const User = require('../Ravetech_Api/models/User');

const apiKey = process.env.STREAM_KEY;
const serverURL = 'http://localhost:3000'; // Replace with your actual server URL

const chatClient = new StreamChat(apiKey);

async function getUserToken(userId) {
  try {
    const response = await axios.get(`${serverURL}/generateToken/${userId}`);
    return response.data.userToken;
  } catch (error) {
    console.error('Error getting user token:', error);
    throw error;
  }
}

async function createGroupChat(users) {
  try {
    const channelType = 'messaging';
    const groupId = shortid.generate();

    const userId = 'user-1'; // Replace with the actual user ID you want to connect
    const userToken = await getUserToken(userId);

    await chatClient.connectUser({ id: userId }, userToken);

    const channel = await chatClient.channel(channelType, groupId, {
      name: `Group${groupId}`,
    });

    await channel.create();
    await channel.addMembers(users);

    for (const userId of users) {
      await User.updateOne({ _id: userId }, { groupId });
    }

    console.log('Group chat created successfully!');
    return groupId;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
}

const users = ['user-1', 'user-2', 'user-3'];

createGroupChat(users)
  .then((groupId) => {
    console.log('Associated group ID:', groupId);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

module.exports = createGroupChat;
