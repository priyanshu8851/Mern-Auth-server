require('dotenv').config();
const nodemailer = require('nodemailer');
const cron = require('node-cron');


// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Email options
const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'priyanshukashyap844@outlook.com',
  subject: 'Scheduled Email from Node.js',
  text: 'Hello! This is a test email sent from a Node.js script using cron jobs.',
};

// Function to send email
const sendEmail = async () => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Execute the function
// cron.schedule('0 12 * * *', () => { //11am
//     console.log('Running Cron Job: Sending Email');
//     sendEmail();
// });
  
  // console.log('Cron job scheduled. Waiting to send emails...');

module.exports={sendEmail};