
import express from 'express';
import nodemailer from "nodemailer";
import 'dotenv/config';



const sendMail=async (email,otp)=>{
    
let {PMAIL,PPASS}= process.env;

const transporter =  nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: PMAIL,
      pass:PPASS,
    },
  });  

  const mailOptions={
    from:{
        name:"ChatMate",
        address:PMAIL,
    },
    to: [email],
    subject: "Otp for signing Up ChatMate",
    text:"The Otp for confirming your E-mail is give below.",
    html:`  <h3>The Otp for confirming your E-mail is give below.</h3>
            <h3>Do not Share this!!!!</h3>
            <h2 style="user-select:none;color:red;font-weight:bolder">${otp}</h2>
            <h3>Use this to Signing Up the Site.</h3>
        ` 
  }
 
    try{
        await transporter.sendMail(mailOptions);
        console.log("trying to send mail");
        return 200;
    } catch(err){
        console.log("error in sending Otp");
        return 500;
 
    }


}

export default sendMail;
