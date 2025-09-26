import nodemailer from 'nodemailer';

export const sendEmail= async (email, subject, link) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        // Use a sender address that matches your Brevo account/domain
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: `Click this link to reset the password: ${link}`
        };

        // Use async/await, not callback
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Email not sent:', error);
        return false;
    }
}

