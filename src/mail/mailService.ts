import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// create reusable transporter with default SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: "roc8assignment@gmail.com",
    pass: "fajj jhgf nctu inmz",
  },
});

// reusable asynchronous send mail function, mail details is the content of mail which will be defined in server
export const SENDMAIL = async (mailDetails: any) => {
  try {
    transporter.sendMail(mailDetails);
  } catch (err) {
    console.error(err);
  }
};
