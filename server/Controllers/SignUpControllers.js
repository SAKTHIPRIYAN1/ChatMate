
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

export const hashPassword=async (password)=>{
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



export const SignUpInitazation= async (req,res)=>{
    console.log(req.body);
    const {email,password,name,id}=req.body;

    // chcking for the user-d's uniqueness...
    try{
        const user= await User.findOne({user_id:id});
        
        if(user){
         return res.status(500).json({msg:"UserId has been already taken."});
        }
     }
     catch(err){
         console.log(err);
         return res.status(500).json({msg:"Internal server Error"});
     }

    // checking for already present email...
    try{
       const user= await User.findOne({email});
       if(user){
        // req.clearCookie('otpToken');
        return res.status(500).json({msg:"Mail has been already Registered"});
       }
    }
    catch(err){
        console.log(err);
        // req.clearCookie('otpToken');
        return res.status(500).json({msg:"Internal server Error"});
    }

    let hashedPassword=await hashPassword(password);

    // new doc for saving otp..
    const OTP=Otp.generateOtp()
    console.log("sent Otp is",OTP);

    // saving Otp in db..
    try{
        await Otp.saveOtp(email,OTP,"Sign-In");
    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }
    console.log(hashedPassword);
    // creating the JWT....
    const otpToken=jwt.sign({email,password:hashedPassword,name,id,purpose:"Sign-In"},process.env.OTP_SECRET,{expiresIn:"5m"});

    // // sending the mail to the user.....
    const response_code_mail=await sendMail(email,OTP,"Sign-In");
    
    // console.log(response_code_mail);
    // console.log(otpToken);

    if(response_code_mail==200){
        res.cookie('otpToken', otpToken, {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: 'none',
            
             
        });
        
        return res.status(200).json({msg:"Otp has been sent successfully."});
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
    console.log(otpToken);
    let name;
    let email;
    let password;
    let id;
    let purpose;

    if(!otpToken){
        return res.status(401).json({msg:'Not Authorized.'});
    }

    jwt.verify(otpToken,process.env.OTP_SECRET,(err,data)=>{
        if(err){
            console.log("incorrect Token")
            return res.status(401).json({msg:'Incorrect Token.'});
        }
        console.log(data);
        name=data.name;
        email=data.email;
        password=data.password;
        id=data.id;
        purpose=data.purpose;
    });

    console.log('after verifyinggg...')
    // check correct otp ...
    try{
    await Otp.verifyOtp(email,otp)
    }
    catch(err){
        // console.log(err);
        return res.status(401).json({msg:"Incorrect Otp /Expiredd Otp"});
    }
 
    // deletOtp once verifyed...
    try{
        await Otp.deleteOne({email});
        }
        catch(err){
            return res.status(401).json({msg:"can't Delete from DB"});
    }

    console.log("deleted....");

    if(purpose=="Sign-In"){
    // save credentials...
        try{
        console.log(name,email,password,id);
        const {SignAccessToken,SignRefreshToken}=await User.saveUser(name,email,password,id);
        console.log(name,email,password,id);
        res.cookie('refreshToken', SignRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000 *1000, // 10 days
            sameSite: 'none',
        });

// clearing the otp token......
        res.clearCookie('otpToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        
        return res.status(200).json({msg:"User Saved Successfully",accessToken:SignAccessToken,data:{name,email,id} });
        }
        catch(err){
            console.error(err)
            return res.status(500).json({msg:err.message});
        }
    }
    else if(purpose=="ChangePassword"){
       const changePassToken=jwt.sign({email},process.env.PASS_SECRET,{expiresIn:"5m"});
       res.cookie(
        "PassToken",changePassToken,
            { httpOnly: true,
                    secure: true,
                    maxAge: 5 * 60 * 1000, 
                    sameSite: 'none',
            }
       )
        return res.status(200).json({msg:"Password can be Changed",pass:true});
    }

    return res.status(500).json({msg:"Internal server Error"});
    // return jwt...
}

export const ResendOtp=async(req,res)=>{
    // checking the token...
    const otpToken=req.cookies.otpToken;
    console.log(otpToken);
    if(!otpToken){
        return res.status(401).json({msg:'Not Authorized.'});
    }
     
    let name;
    let email;
    let password;
    let purpose;

    jwt.verify(otpToken,process.env.OTP_SECRET,(err,data)=>{
        if(err){return res.status(401).json({msg:'Incorrect Token.'});
        }
        console.log(data);
        name=data.name;
        email=data.email;
        password=data.password;
        purpose=data.purpose;
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
        await Otp.saveOtp(email,OTP,purpose);
    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }
  
    // creating the JWT....
    // const otpToken=jwt.sign({email,password,name},process.env.OTP_SECRET,{expiresIn:"5m"});

    // // sending the mail to the user.....
    const response_code_mail=await sendMail(email,OTP,purpose);
    
    // console.log(response_code_mail);
    // console.log(otpToken);

    if(response_code_mail==200){
        return res.status(200).json({msg:"Otp has been sent successfully"});
    }


    return res.status(500).json({msg:"Error in sending Mail"});
}


