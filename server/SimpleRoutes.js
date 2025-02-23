import express from 'express';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from './Models/UserModel.js';
const PreAuthRoute=express.Router();

PreAuthRoute.post("/", async(req, res) => {
    const { Purpose } = req.body;
    console.log(Purpose);
    let finalData;
    if (Purpose == "login") {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ msg: "No refresh token provided." });
        }

        

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,async(err, data) => {
            if (err) {
                return res.status(401).json({ msg: "Incorrect Token." });
            }
            finalData=data;
            console.log(data);
            console.log(finalData);
            const {profile}=await User.findOne({user_id:finalData.id});
            finalData["profile"]="/uploads/profilePic/"+profile;
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
});


export default PreAuthRoute;