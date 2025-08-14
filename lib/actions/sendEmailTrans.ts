"use server";
import nodemailer from 'nodemailer';
import { formatKsh } from '../help';

export async function sendEmailTrans(
  to: string,
  firstName: string,
  orderTrackingId: string,
  merchantId: string,
  plan: string,
  period: string,
  amount: string,
  createdAt: string

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
    to: to,
    subject: "Payment Receipt",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                 <span style="display: inline-flex; align-items: center; gap: 6px;">
                 <img src="https://tadaomarket.com/logo.png" alt="Tadao Logo" style="height: 24px; width: auto; display: block;" />
                  <span style="font-size: 14px; font-weight: bold; color: #BD7A4F;">Tadao</span>
                </span>
              </div>
    
              <h2 style="color: #BD7A4F;">Payment Receipt</h2>
               <p>Hello ${firstName || "Customer"},</p>
               <p>Thank you for your payment. Here are your receipt details:</p>
    
              <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #BD7A4F; border-radius: 5px;">
              <p><strong>Order ID:</strong> ${orderTrackingId}</p>
              <p><strong>merchant ID:</strong> ${merchantId}</p>
              <p><strong>Package:</strong> ${plan}</p>
              <p><strong>Period:</strong> ${period !== "0" ? period : "Unlimited"}</p>
              <p><strong>Amount:</strong> KES ${formatKsh(amount)}</p>
              <p><strong>Date:</strong> ${createdAt}</p>
              </div>
              <p style="margin-top: 30px;">If you have any questions, please contact our support at <a href="mailto:support@tadaomarket.com">support@tadaomarket.com</a>.</p>
              <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
              <p style="font-size: 12px; color: #999;">This email was sent by Tadao (<a href="https://tadaomarket.com" style="color: #999;">tadaomarket.com</a>).</p>
              </div>
            
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    //console.log('Email sent:', response);
    return "success";
  } catch (error) {
    console.error('Error sending email:', error);
    return "Failed";
  }
}
