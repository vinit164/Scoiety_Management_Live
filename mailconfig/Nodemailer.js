const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'patelvinit135@gmail.com', 
    pass: 'yhnw ntph esma psib',  
  },
  tls: {
    rejectUnauthorized: false, // Ignore self-signed certificate issues
  },
});

const sendEmail = async ({to , subject, text}) => {
  try {
    const info = await transporter.sendMail({
      from: 'patelvinit135@gmail.com', 
      to : to,
      subject: subject,
      text : text ,
    });
    
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail 