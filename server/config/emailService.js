import nodemailer from 'nodemailer';
import http from 'http';

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',          // SMTP host (e.g., for Gmail)
  port: 465,                       // Secure port for Gmail
  secure: true,                    // Use SSL
  auth: {
    user: process.env.EMAIL,       // Your Gmail address from environment variable
    pass: process.env.EMAIL_PASS   // App password or Gmail password
  }
});

// Function to send email 
async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,  // Sender email
      to,                       // Recipient(s)
      subject,                  // Email subject
      text,                     // Plain text content
      html                      // HTML content
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}



export {sendEmail};


