
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// mail import....
import sendMail from './mailcontroller.js';

// model import....
import Otp from '../Models/otpModel.js';
import User from '../Models/UserModel.js';

import 'dotenv/config'
// first make the jwt for storing  pass and user name..
// send to client..

const hashPassword=async (password)=>{
    let saltround=10;
    let hashedPassword=await bcrypt.hash(password,saltround);
    return hashedPassword;
}

const ListTostring=(otp)=>{
    let str="";
    for(let i=0;i<6;i++){
        str+=otp[i];
    }
    return str;
}

const extractToken=(otpToken)=>{
    jwt.verify(otpToken,process.env.OTP_SECRET,(err,data)=>{
        if(err){
            return {};
        }
        console.log(data);
        return data;
    });

    return {};
}

export const SignUpInitazation= async (req,res)=>{
    console.log(req.body);
    const {email,password,name}=req.body;
    let hashedPassword=await hashPassword(password);

    // new doc for saving otp..
    const OTP=Otp.generateOtp()
    console.log("sent Otp is",OTP);

    // saving Otp in db..
    try{
        await Otp.saveOtp(email,OTP);
    }
    catch(err){
        return res.status(500).json({msg:err});
    }
    console.log(hashedPassword);
    // creating the JWT....
    const otpToken=jwt.sign({email,password:hashedPassword,name},process.env.OTP_SECRET,{expiresIn:"5m"});

    // // sending the mail to the user.....
    const response_code_mail=await sendMail(email,OTP);
    
    // console.log(response_code_mail);
    // console.log(otpToken);

    if(response_code_mail==200){
        res.cookie('otpToken', otpToken, {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: 'none',
            
             
        });
        
        return res.status(200).json({msg:"Otp sent"});
    }

    return res.status(500).json({msg:"Error in sending Mail"});
}

// for verifying Otp......
export const VerifyOtp=async(req,res)=>{

    let {otp}=req.body;
    otp=JSON.parse(otp);
    otp=ListTostring(otp);
    console.log(otp);

    // checking the token...
    const otpToken=req.cookies.otpToken;
    // console.log(otpToken);
    let name;
    let email;
    let password;

    jwt.verify(otpToken,process.env.OTP_SECRET,(err,data)=>{
        if(err){return res.status(401).json({msg:'Incorrect Token.'});
        }
        console.log(data);
        name=data.name;
        email=data.email;
        password=data.password;
    });

    // check correct otp ...
    try{
    await Otp.verifyOtp(email,otp)
    }
    catch(err){
        console.log(err);
        return res.status(401).json({msg:err});
    }

    // deletOtp once verifyed...
    try{
        await Otp.deleteOne({email});
        }
        catch(err){
            return res.status(401).json({msg:"can't Delete from DB"});
    }

    // save credentials...
    try{
      const SignUpToken=await User.saveUser(name,email,password);
      res.cookie('SignUpToken', SignUpToken, {
        httpOnly: true,
        secure: true,
        maxAge: 5 * 60 * 1000, // 5 minutes
        sameSite: 'none',
    });
    
    return res.status(200).json({msg:"User Saved Successfully"});
    }
    catch(err){
        console.error(err)
        return res.status(500).json({msg:err});
    }

    // return jwt...
}

export const ResendOtp=async(req,res)=>{
    // checking the token...
    const otpToken=req.cookies.otpToken;
    console.log(otpToken);

     
     let name;
    let email;
    let password;

    jwt.verify(otpToken,process.env.OTP_SECRET,(err,data)=>{
        if(err){return res.status(401).json({msg:'Incorrect Token.'});
        }
        console.log(data);
        name=data.name;
        email=data.email;
        password=data.password;
    });

    console.log(email,name);
    // new doc for saving otp..
    const OTP=Otp.generateOtp()

    console.log("sent Otp is",OTP);

    try{
        await Otp.deleteOne({email});
        console.log("otp Deleted");
    }
    catch(err){
        return res.status(500).json({msg:"err in resending"});
    }
    // saving Otp in db..
    try{
        await Otp.saveOtp(email,OTP);
    }
    catch(err){
        return res.status(500).json({msg:err});
    }
  
    // creating the JWT....
    // const otpToken=jwt.sign({email,password,name},process.env.OTP_SECRET,{expiresIn:"5m"});

    // // sending the mail to the user.....
    const response_code_mail=await sendMail(email,OTP);
    
    // console.log(response_code_mail);
    // console.log(otpToken);

    if(response_code_mail==200){
        return res.status(200).json({msg:"Otp sent"});
    }

    return res.status(500).json({msg:"Error in sending Mail"});
}


