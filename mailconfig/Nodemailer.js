const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'kanjiyaparas2002@gmail.com', 
    pass: 'nivl zjrk kpmw hhnj',  
  },
});

const sendEmail = async ({to , subject, text}) => {
  try {
    const info = await transporter.sendMail({
      from: 'kanjiyaparas2002@gmail.com', 
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