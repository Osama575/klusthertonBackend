require('dotenv').config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const chatServiceSid = process.env.CONVERSATIONS_SID;

const client = require('twilio')(accountSid, authToken);

async function sendGroupMessage(userIds, messageBody) {
  try {
    // Create or retrieve a conversation channel
    const conversation = await client.conversations.v1.services(chatServiceSid)
      .conversations
      .create({
        friendlyName: 'Group Chat',
      });

    // Add participants to the conversation based on user IDs
    const participants = await Promise.all(userIds.map(userId => {
      return client.conversations.v1.services(chatServiceSid)
        .conversations(conversation.sid)
        .participants
        .create({ identity: userId });
    }));

    // Send a message to the group
    const message = await client.conversations.v1.services(chatServiceSid)
      .conversations(conversation.sid)
      .messages
      .create({
        body: messageBody,
        author: 'system', // You can customize the author as needed
      });

    console.log('Group message sent:', message.sid);
  } catch (error) {
    console.error('Error sending group message:', error.message);
  }
}

// Example usage
const userIds = ['user1', 'user2', 'user3']; // Replace with actual user IDs
const messageBody = 'Hello from Twilio Conversations!';

sendGroupMessage(userIds, messageBody);
