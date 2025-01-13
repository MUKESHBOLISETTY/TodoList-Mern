const nodemailer = require('nodemailer');
const { config } = require("dotenv");

config();
module.exports = async (mail, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
              user: process.env.MAIL,
              pass: process.env.PASSWORD,
            },
          });

          const send = await transporter.sendMail({
            from: '"ToDo App" <9398291569m@gmail.com>', 
            to: mail,
            subject: subject,
            text: text, 
          });
          console.log(send)
    } catch (error) {
        console.log(error)
    }
}
