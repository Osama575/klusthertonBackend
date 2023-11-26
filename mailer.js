const nodemailer = require('nodemailer');
const User = require('././models/User');
const Event = require('././models/Event');
const  Course = require('././models/Course');

require('dotenv').config()

async function sendStudySessionEmail(groupId, eventDetails, tag) {
    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME, //  your Gmail
            pass: process.env.EMAIL_PASSWORD // your Gmail password or App password
        }
    });

    const courseName = "Example Course"; // Fetch course name based on groupId
    const userEmails = ['user1@example.com', 'user2@example.com']; // Replace with actual emails fetched based on groupId

    const emailSubject = tag === 'instant-meeting' ? `Instant Study Session for ${courseName}` : `Upcoming Study Session for ${courseName}`;
    
    const emailBody = `
        <html>
        <head>
            <style>
                .email-container {
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                }
                .button {
                    background-color: #4CAF50;
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 8px;
                }
                .header {
                    background-color: #333;
                    color: white;
                    padding: 10px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>${courseName}</h1>
                </div>
                <p>You have a ${tag === 'instant-meeting' ? 'new instant' : 'scheduled'} study session!</p>
                <p><strong>Start Time:</strong> ${eventDetails.startTime}</p>
                <p><strong>End Time:</strong> ${eventDetails.endTime}</p>
                <a href="${eventDetails.meetLink}" class="button">Join Now</a>
            </div>
        </body>
        </html>
    `;

    // Send email to each user
    for (const email of userEmails) {
        await transporter.sendMail({
            from: 'foresightagencies@gmail.com', // Your Gmail
            to: email,
            subject: emailSubject,
            html: emailBody
        });
    }
}


const Course = require('./models/Course'); // Import your Course model
const User = require('./models/User');     // Import your User model

async function getCourseAndUserEmails(groupId) {
    try {
        // Find the course associated with the groupId
        const course = await Course.findOne({ 'groups.groupId': groupId });
        if (!course) {
            throw new Error(`Course not found for group ID: ${groupId}`);
        }

        // Extract the course name
        const courseName = course.name;

        // Find users who are members of the group
        const users = await User.find({
            'chat.groups': { $elemMatch: { groupId } }
        }).select('email'); // Select only email field

        // Extract user emails
        const userEmails = users.map(user => user.email);

        return { courseName, userEmails };
    } catch (error) {
        console.error(`Error in getCourseAndUserEmails: ${error}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Example usage
// getCourseAndUserEmails('group-id-example')
//     .then(data => console.log(data))
//     .catch(error => console.error(error));


// Example usage
// sendStudySessionEmail('group-id-example', {
//     startTime: '2023-04-01T10:00:00',
//     endTime: '2023-04-01T12:00:00',
//     meetLink: 'https://meet.link',
// }, 'instant-meeting')
// .then(() => console.log('Emails sent successfully'))
// .catch(error => console.error('Error sending emails:', error));
