import e from 'express';
import { Router } from 'express';
import AnnonUser from '../Models/AnnonModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const RandomRoute=e.Router();

const generateAuthKey = () => {
    return crypto.randomBytes(32).toString("hex"); // 64-bit random key
};


const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};


RandomRoute.get("/",async(req,res)=>{
    const {refreshToken}=req.cookies;

    if (!refreshToken) {
        console.log("No refreshToken.... Generating new Auth & Tokens.");

        const Auth = generateAuthKey();

        // adding to the tmp User Db....
        const newAnnonUser=new AnnonUser({
            user_id:Auth
        })
       try{
            await newAnnonUser.save();
            console.log("new Temp User saved..")
        }
         catch(err){
            res.status(500).json({msg:err.mesage});
         }
        

        const accessToken = jwt.sign({ Auth }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // Short-lived
        const newRefreshToken = jwt.sign({ Auth }, process.env.ANNON_TOKEN , { expiresIn: "7d" }); // Long-lived

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000 *50000, // 10 days
            sameSite: 'none',
        });
        return res.status(200).json({ Auth, accessToken });
    }

    // Decode the refresh token
    const decoded = verifyToken(refreshToken, process.env.ANNON_TOKEN);

    if (!decoded) {
        console.log("Invalid refresh token. Generating new Auth & Tokens.");
        const Auth = generateAuthKey();
        const accessToken = jwt.sign({ Auth }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jwt.sign({ Auth }, process.env.ANNON_TOKEN, { expiresIn: "7d" });

        res.cookie("refreshToken", newRefreshToken,  {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000 *1000, // 10 days
            sameSite: 'none',
        });

        return res.status(200).json({ Auth, accessToken, refreshToken: newRefreshToken });
    }

    console.log("Valid refresh token found. Returning access token.");
    const { Auth } = decoded;
    const newAccessToken = jwt.sign({ Auth }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    return res.status(200).json({ Auth, accessToken: newAccessToken });

});

export default RandomRoute;
