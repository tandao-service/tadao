"use server"

import { CreateBookmarkParams, CreatePackagesParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"

import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"

import Bookmark from "../database/models/bookmark.model"
//import Product from "../database/models/product.model"
//import Subscriber from "../database/models/NotifySchema"
import User from "../database/models/user.model"
import nodemailer from 'nodemailer';
import axios from "axios"

export async function broadcastMessage(type: string, message: string) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch users' emails or phone numbers
    const userContacts = await User.find({}, type === 'email' ? 'email' : 'phone')
      .then((users) => users.map((u) => (type === 'email' ? u.email : u.phone)).filter(Boolean));

    // Fetch subscribers based on type (email or phone)
   // const subscribers = await Subscriber.find({
   //   contact: type === 'email' ? { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } : { $regex: /^\+?[0-9]{7,}$/ },
   // }).then((subs) => subs.map((s) => s.contact));

    // Deduplicate recipients
    const subscribers:any=[];
    const recipients = Array.from(new Set([...userContacts, ...subscribers]));

    if (recipients.length === 0) {
      return { message: `No ${type} recipients found.` };
    }

    // Handle email sending
    if (type === 'email') {
     // console.log("email")
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    //  console.log("transporter: "+transporter)
      for (const email of recipients) {
        const mailOptions = {
          from: '"PocketShop" <support@pocketshop.co.ke>',
          to: email,
          subject: 'Important Notification',
          text: message,
        };

      const response =  await transporter.sendMail(mailOptions);
       // console.log(response)
      }
    }

    // Handle SMS sending
    if (type === 'sms') {
      for (const phone of recipients) {
        const smsUrl = `http://107.20.199.106/sms/1/text/query?username=Ezeshatrans&password=5050Martin.com&from=Ezesha&text=${encodeURIComponent(
          message
        )}&to=${phone}`;

        const requestHeaders = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };

        await axios.get(smsUrl, { headers: requestHeaders });
      }
    }

    return { message: `${type === 'email' ? 'Emails' : 'SMS messages'} sent successfully to all recipients.` };
  } catch (error) {
    console.error('Error in broadcastMessage:', error);
    throw new Error('Failed to send messages.');
  }
}

