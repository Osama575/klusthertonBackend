const nodemailer = require('nodemailer');

async function sendEmail(userEmail, userName, courseName) {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'team.feego.hackathon@gmail.com', // Replace with your email
            pass: 'hvjldmgnwdneeynj', // Replace with your password
        },
    });

    // Setup email data
    // Email content
    let mailOptions = {
        from: '"Intelligo App" <team.feego.hackathon@gmail.com>',
        to: userEmail,
        subject: 'Study Booth Assignment for ' + courseName,
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h1 style="color: #800080; font-weight: bold;">Hello ${userName},</h1>
                <p>You have been assigned to a study booth for the course: ${courseName}.</p>
                <p>This is an excellent opportunity to deepen your understanding and collaborate with peers.</p>
                <p>To access your study booth, please visit <a href="https://intelligo.vercel.app/" style="color: #800080; text-decoration: none;">Intelligo</a>.</p>
                <footer>
                    <p><small>© ${new Date().getFullYear()} Intelligo. All rights reserved.</small></p>
                </footer>
            </div>`
    };
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
}

// Usage example
// sendEmail('kayanleye@gmail.com', 'kehinde ayanleye', 'Project Management Fundamentals')
//     .then(() => console.log('Email sent successfully!'))
//     .catch(error => console.error('Failed to send email:', error));
