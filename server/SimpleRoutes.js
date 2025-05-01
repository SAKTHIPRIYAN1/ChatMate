import express from 'express';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from './Models/UserModel.js';
const PreAuthRoute=express.Router();

PreAuthRoute.post("/", async(req, res) => {
    const { Purpose } = req.body;
    console.log(Purpose);
    let finalData;
    try{
    if (Purpose == "login") {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            throw new Error("No refresh token provided.");
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,async(err, data) => {
            if (err) {
                console.log( "Incorrect Token." );
                return res.status(401).json({ msg: "Incorrect Token." });;
            }
            finalData=data;
            console.log(data);
            console.log(finalData);
            const u=await User.findOne({user_id:finalData.id});
            if(u){
                finalData["profile"]=u.profile;
            }
            return res.status(200).json({ data:finalData });
        });

    } else if (Purpose == "otp") {
        const { otpToken } = req.cookies;

        if (!otpToken) {
            return res.status(500).json({ msg: "No OTP token provided." });
        }

        return res.status(200).json({ msg: "OTP token verified." });
    } else if (Purpose == "pass") {
        const { PassToken } = req.cookies;
        console.log(req.cookies);

        if (!PassToken) {
            return res.status(500).json({ msg: "No password token provided." });
        }

        return res.status(200).json({ msg: "Password token verified." });
    }
    }catch(err){
        res.status(401).json({ msg: err.message });
        console.log(err);
    }
});



export default PreAuthRoute;