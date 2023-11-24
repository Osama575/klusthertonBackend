const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const Event = require('./EventModel'); // Your event schema

const scheduleStudySession = async (req, res) => {
    const { tag, users, startTime, endTime, redirect} = req.body;

    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirect
    );

    // Assuming you have a way to retrieve each user's OAuth token
    for (const userEmail of users) {
        oauth2Client.setCredentials({ access_token: 'USER_ACCESS_TOKEN' });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const event = {
            summary: 'Study Session',
            start: {
                dateTime: startTime,
                timeZone: 'Your/Timezone',
            },
            end: {
                dateTime: endTime,
                timeZone: 'Your/Timezone',
            },
            attendees: [{ email: userEmail }],
            conferenceData: {
                createRequest: { requestId: `some-random-string-${Date.now()}` }
            },
            // Other event details
        };

        try {
            const response = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                conferenceDataVersion: 1,
            });

            const meetLink = response.data.hangoutLink; // Google Meet link
            await Event.create({ ...event, link: meetLink, users, createdAt: new Date(), tag });

            // If the meeting is instant, return the meet link immediately
            if (tag === 'instant-meeting') {
                return res.json({ meetLink });
            }

        } catch (error) {
            console.error('Error creating event:', error);
            return res.status(500).send('Error scheduling event');
        }
    }

    return res.send('Events scheduled successfully');
};

module.exports = scheduleStudySession;
