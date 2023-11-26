const { google } = require('googleapis');
const Event = require('./EventModel'); // Your event schema

const scheduleStudySession = async (req, res) => {
    const { tag, users, startTime, endTime } = req.body;

    // Configure a JWT client with service account credentials
    const auth = new google.auth.GoogleAuth({
        keyFile: '../intelligo-405118-6d9014e6c967.json', // Path to your service account JSON key file
        scopes: 'https://www.googleapis.com/auth/calendar',
    });

    const calendar = google.calendar({ version: 'v3', auth });

    for (const userEmail of users) {
        const event = {
            summary: 'Study Session',
            start: { dateTime: startTime, timeZone: 'Africa/Lagos' },
            end: { dateTime: endTime, timeZone: 'Africa/Lagos' },
            attendees: [{ email: userEmail }],
            conferenceData: { createRequest: { requestId: `data-${Date.now()}` } },
            // Other event details
        };



        try {
            const response = await calendar.events.insert({
                calendarId: 'primary', // Or the specific calendar ID of the admin or the user
                resource: event,
                conferenceDataVersion: 1,
                sendNotifications: true, // If you want to send email notifications to attendees
                auth: await auth.getClient(), // Authenticate as the service account
            });

            const meetLink = response.data.hangoutLink; // Google Meet link
            await Event.create({ ...event, link: meetLink, users, createdAt: new Date(), tag });

            if (tag === 'instant-meeting') {
                return res.status(200).json({ meetLink });
            }
        } catch (error) {
            console.error('Error creating event:', error);
            return res.status(500).send('Error scheduling event');
        }
    }

    return res.status(201).send('Events scheduled successfully');
};

module.exports = scheduleStudySession;
