import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (to, subject,  html) => {
  const info = await transporter.sendMail({
    from: "sanamanisiddharam69@gmail.com", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html, // plain text body
  });
};
