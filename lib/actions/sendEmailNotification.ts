"use server";
import nodemailer from 'nodemailer';

export async function sendEmailNotification(
  recipientEmail: string,
  message: string,
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


  const mailOptions = {
    from: '"Tadao" <support@tadaomarket.com>',
    to: recipientEmail,
    subject: `You've got a message from Tadao`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
         <span style="display: inline-flex; align-items: center; gap: 6px;">
  <img src="https://tadaomarket.com/logo.png" alt="Tadao Logo" style="height: 24px; width: auto; display: block;" />
  <span style="font-size: 14px; font-weight: bold; color: #FF914C;">Tadao</span>
</span>
        </div>

        <h2 style="color: #FF914C;">You've got a message from Tadao</h2>
        <p>Hello,</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #FF914C; border-radius: 5px;">
          <p style="margin: 0;">"${message}"</p>
        </div>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999;">This email was sent by Tadao (<a href="https://tadaomarket.com" style="color: #999;">tadaomarket.com</a>).</p>
      </div>
    `,
  };


  try {
    const response = await transporter.sendMail(mailOptions);
    console.log('Email sent:', response);
    return "success";
  } catch (error) {
    console.error('Error sending email:', error);
    return "Failed";
  }
}
