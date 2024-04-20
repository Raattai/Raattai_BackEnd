const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shyamsaran0206@gmail.com',
        pass: 'vyki efil wiww ybav',
    }
});

// Define the sendEmail function
async function sendEmail(to, subject, text, html) {
    // Setup email data
    const mailOptions = {
        from: 'shyamsaran0206@gmail.com',
        to: to, // Recipient's email address
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html // HTML body
    };

    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return 'Email sent successfully';
    } catch (error) {
        console.error(error);
        throw new Error('Error sending email');
    }
}

module.exports = sendEmail;
