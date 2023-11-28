// const { google } = require('googleapis');
// const Event = require('../models/Event'); // Your event schema


// const scheduleStudySession = async (req, res) => {
//     const { tag, users, startTime, endTime, groupId } = req.body;

//     // Configure a JWT client with service account credentials
//     const jwtClient = new google.auth.JWT(
//         key.client_email,
//         null,
//         key.private_key,
//         ['https://www.googleapis.com/auth/calendar'], // Scope for Google Calendar
//         "rave@foresightng.tech" // Email of the user to impersonate
//       );
      
//       // Create the Calendar service.
//       const calendar = google.calendar({version: 'v3', auth: jwtClient});


//     const event = {
//         summary: 'Study Session',
//         start: { dateTime: startTime, timeZone: 'Africa/Lagos' },
//         end: { dateTime: endTime, timeZone: 'Africa/Lagos' },
//         conferenceData: {
//             createRequest: {
//                 requestId: `data-${Date.now()}`,       
//         },
//     },
//     attendees: users.map(email => ({ email })),
        
        
    

        
//         // Other event details
//     };

//     const response = await calendar.events.insert({
//         calendarId: 'primary',
//         resource: event,
//         conferenceDataVersion: 1,
//         sendNotifications: true,
//     });
    
//     const meetLink = response.data.hangoutLink; // Google Meet link

//     if (tag === 'instant-meeting') {
//         return res.status(200).json({ meetLink });
//     } 

//     for (const userEmail of users) {
//         try {
        
//            console.log(userEmail)
//         } catch (error) {
//             console.error('Error creating event:', error);
//             return res.status(500).send('Error scheduling event');
//         }
//     }
//     const meetScheduled =   await Event.create({ ...event, link: meetLink, users, createdAt: new Date(), tag });

//     if(!meetScheduled) {
//         return res.status(500).json({message:'Event could not be scheduled, please try again'});
//       }
//     return res.status(201).json({message:'Events scheduled successfully', event:meetScheduled});
// };

// const extractEmails = async (req, res) => {
//     try {
//         const { groupId } = req.body;

//         // Fetch the group members from Stream Chat
//         const channel = chatClient.channel('messaging', groupId);
//         const state = await channel.watch();
//         const userIds = state.members.map(member => member.user_id);

//         // Query the database for user emails
//         const users = await User.find({ _id: { $in: userIds } });
//         const emails = users.map(user => user.email);

//         // Send response
//         res.status(200).json({ emails });
//     } catch (error) {
//         console.error('Error fetching group emails:', error);
//         res.status(500).json({ message: 'Error fetching group emails', error: error.message });
//     }
// };

// const getUpcomingEvents = async (req, res) => {
//     try {
//         const userId = req.user.userid; //  req.user.userid holds the current user's ID

//         // Fetch events for this user
//         const events = await Event.find({ 'users': userId });

//         // Filter out past events
//         const currentTime = new Date();
//         const upcomingEvents = events.filter(event => {
//             const startTime = new Date(event.startTime);
//             const endTime = new Date(event.endTime);
//             return currentTime <= endTime;
//         });

//         // Send response with upcoming events
//         res.status(200).json(upcomingEvents);
//     } catch (error) {
//         console.error('Error fetching upcoming events:', error);
//         res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
//     }
// };

// module.exports = {scheduleStudySession, extractEmails, getUpcomingEvents}
