
import User from "../Models/UserModel.js";
import Otp from "../Models/otpModel.js";
import jwt from 'jsonwebtoken';
import sendMail from "./mailcontroller.js";

import bcrypt from 'bcrypt';
import { hashPassword } from "./SignUpControllers.js";

const LoginHandler=async (req,res)=>{
    const {id,password}=req.body;

    try{
        const {SignAccessToken,SignRefreshToken,data}=await User.login({id,password});
        res.cookie('refreshToken', SignRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: 'none',
        });
        
        return res.status(200).json({msg:"User Logged In Successfully",accessToken:SignAccessToken,data});
    }
    catch(err){
        // console.log("error",err);    
        return res.status(401).json({msg:err.message});
    }
};

export const changePasswordRequest=async (req,res)=>{
    console.log(req.body);
    const {email}=req.body;
    console.log(email);

     // checking for already present email...
     try{
        const user= await User.findOne({email});
        if(!user){
         return res.status(500).json({msg:"No Registered Mail found."});
        }
     }
     catch(err){
         console.log(err);
         return res.status(500).json({msg:err.message});
     }

    //  sending email...
    const OTP=Otp.generateOtp()
    console.log("sent Otp is",OTP);

    // saving Otp in db..
    try{
        await Otp.saveOtp(email,OTP,"ChangePassword");
    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }

    const otpToken=jwt.sign({email,purpose:"ChangePassword",otp:OTP},process.env.OTP_SECRET,{expiresIn:"5m"});

    try{
    // // sending the mail to the user.....
    const response_code_mail=await sendMail(email,OTP,"ChangePassword");
    if(response_code_mail==200){
        res.cookie('otpToken', otpToken, {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: 'none',
            
             
        });   
    return res.status(200).json({msg:"Otp has been sent to your email."});
    }
    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }
    
    return res.status(500).json({msg:"Error in sending Mail"});
}


export const ConfirmPassword= async (req,res)=>{
    const {PassToken}=req.cookies;
    const {password}=req.body;
    if(!PassToken){
        return res.status(401).json({msg:"Not Authorized, Please retry."});
    }
        let email;
        jwt.verify(PassToken,process.env.PASS_SECRET,(err,data)=>{
            if(err){
                console.log("incorrect Token")
                return res.status(401).json({msg:'Incorrect Token.'});
            }
            console.log(data);
            email=data.email;
        });
    
    try{
        let user=User.findOne({email});
        if(!user){
            throw new Error ("No records Found.")
        }

        let hashedPassword= await hashPassword(password);

        await user.updateOne({email},{$set:{password:hashedPassword}});

        return res.status(200).json({msg:"PassWord Updated Successfully."});

    }catch(err){
        return res.status(500).json({msg:err.message});
    }
   
}

export default LoginHandler;