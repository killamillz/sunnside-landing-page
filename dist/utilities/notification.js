"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.sendmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.GMAIL_USER}`,
        pass: `${process.env.GMAIL_PASSWORD}`
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendmail = async (from, to, subject, html) => {
    //     try {
    const response = await exports.transporter.sendMail({
        from: `${process.env.GMAIL_USER}`,
        to,
        subject: "welcome",
        html
    });
    //     } catch (error) {
    //          console.log('err')
    //     }
};
exports.sendmail = sendmail;
const emailHtml = (email, password) => {
    const mail = `<h1>Welcome</h1>
          <p>Your username: ${email}</p><br>
          <p>Your:Password: ${password}</p><br>
          <p>Thank you</p>`;
    return mail;
};
exports.emailHtml = emailHtml;
