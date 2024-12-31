import express from 'express';
import { SignUpInitazation,VerifyOtp,ResendOtp } from '../Controllers/SignUpControllers.js';
const SignUpRoute=express.Router();

SignUpRoute.post("/",SignUpInitazation);
SignUpRoute.post("/verify-otp",VerifyOtp);
SignUpRoute.get("/resend-otp",ResendOtp);
export default {SignUpRoute};
 
