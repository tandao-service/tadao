"use server";
import nodemailer from 'nodemailer';

export async function sendEmail(
  recipientEmail: string, 
  message: string, 
  adTitle: string, 
  adUrl: string,
  userName : string,
  userImage: string
) {

 let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Your SMTP host
  port: 587, // Use 587 for TLS
  secure: false, // True if using port 465
  auth: {
    user: process.env.SMTP_USER, // Your SMTP user
    pass: process.env.SMTP_PASS, // Your SMTP password
  }
});

  let mailOptions = {
    from: '"AutoYard" <no-reply@autoyard.co.ke>',
    to: recipientEmail,
    subject: "New Inquiry on Your Ad",
    text: `You have a new inquiry on your ad titled "${adTitle}". \n\nMessage: ${message}\n\nFrom: ${userName}\n\Kindly replay on AutoYard\n\n`,
    html: `<p>You have a new inquiry on your ad titled "<b>${adTitle}</b>".</p><p>Message: ${message}</p><p>From: ${userName}</p><p><b>Kindly replay on AutoYard</b></p></p>`,
  };
  //let mailOptions = {
  //  from: '"Autoyard" <no-reply@autoyard.co.ke>',
  //  to: recipientEmail,
  //  subject: 'New Inquiry on Your Ad',
   // text: `You have a new inquiry on your ad titled "${adTitle}".\n\nMessage: ${message}\n\nView the ad here: ${adUrl}`,
   // html: `<p>You have a new inquiry on your ad titled "<b>${adTitle}</b>".</p><p>Message: ${message}</p><p><a href="${adUrl}">View the ad</a></p>`,
  //};

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log('Email sent:', response);
    return "success";
  } catch (error) {
    console.error('Error sending email:', error);
    return "Failed";
  }
}
