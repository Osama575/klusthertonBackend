const shortid = require('shortid');
const { StreamChat } = require('stream-chat');
const User = require('../Ravetech_Api/models/User')

// Initialize Stream Chat client with your API key and secret
const apiKey = process.env.STREAM_KEY;
const apiSecret = process.env.STREAM_SECRET;
const chatClient = new StreamChat(apiKey, apiSecret);

// Function to create a group chat, add participants, and update user objects
async function createGroupChat( users) {
  try {
    const channelType = 'messaging';
    // Generate a random and unique channel ID using shortid
    const groupId = shortid.generate();

    // Create a channel of the specified type and ID
    const channel = await chatClient.channel(channelType, groupId, {
      name: `Group${groupId}`
      // Additional custom channel data
    });

    // Create the channel
    await channel.create();

    // Add participants to the channel
    await channel.addMembers(users);

    // Save the group ID in your user database for each participant
    for (const userId of users) {
      // Assume you have a MongoDB model named User and an updateOne method
      // Adapt this part based on your actual database and data model
      await User.updateOne({ _id: userId }, { groupId });
    }

    console.log('Group chat created successfully!');
    return groupId;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
}

// Example usage:

const users = ['user-1', 'user-2', 'user-3'];

createGroupChat(channelType, users)
  .then((groupId) => {
    console.log('Associated group ID:', groupId);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  module.exports = createGroupChat