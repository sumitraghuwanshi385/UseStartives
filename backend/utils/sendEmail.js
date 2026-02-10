const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Startives Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4F46E5;">Welcome to Startives!</h2>
                    <p>You are one step away from joining the collective.</p>
                    <p>Your verification code is:</p>
                    <h1 style="background-color: #f3f4f6; padding: 10px; display: inline-block; border-radius: 5px; letter-spacing: 5px;">${text}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

module.exports = sendEmail;