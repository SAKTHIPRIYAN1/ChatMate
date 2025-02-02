import express from 'express';
import { Router } from 'express';

const PreAuthRoute=express.Router();

PreAuthRoute.post("/",(req,res)=>{
    const {Purpose}=req.body;
    console.log(Purpose);
    if(Purpose=="otp"){
        const {otpToken}=req.cookies;
        if(!otpToken)
            return res.status(500).json({msg:"jii"});
        return res.status(200).json({msg:"jii"});
    }

    if(Purpose=="pass"){
        const {PassToken}=req.cookies;
        console.log(req.cookies);
        if(!PassToken)
            return res.status(500).json({msg:"jii"});
        return res.status(200).json({msg:"jii"});
    }

    console.log(Purpose);
   return res.status(500).json({msg:"jii"});
})

export default PreAuthRoute;