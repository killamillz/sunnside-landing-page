import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
         user: `${process.env.GMAIL_USER}`,
         pass: `${process.env.GMAIL_PASSWORD}`
    },
    tls:{
         rejectUnauthorized: false
    }
 })



export const sendmail = async(from:string, to:string, subject:string, html:string)=>{
//     try {
         const response = await transporter.sendMail({
              from: `${process.env.GMAIL_USER}`,
              to,
              subject: "welcome",
              html
         })
//     } catch (error) {
//          console.log('err')
//     }
}


export const emailHtml = (email:string, password:string)=>{

     const mail =  
          `<h1>Welcome</h1>
          <p>Your username: ${email}</p><br>
          <p>Your:Password: ${password}</p><br>
          <p>Thank you</p>`
     return mail;
}
