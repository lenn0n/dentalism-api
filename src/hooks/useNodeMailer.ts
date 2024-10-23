const nodemailer = require('nodemailer');

interface NodeMailerProps {
  sendTo: string,
  subject: string,
  html: string,
}

export const useNodeMailer = ({ sendTo, subject, html }: NodeMailerProps) => {
  // Create transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail as the email service
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW, 
    },
  });

  // Setup email options
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: sendTo, 
    subject,
    html: html,
  };

  const sendEmail = async () => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error: any) => {
        if (error) {
          return reject(error)
        }
        return resolve(true)
      });
    })
  }

  return {
    sendEmail
  }
}

export default useNodeMailer