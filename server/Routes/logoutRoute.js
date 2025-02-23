import e from 'express';
import { Router } from 'express';


const LogoutRoute=e.Router();

LogoutRoute.get("/",async(req,res)=>{
    console.log("heyyy");
    console.log(req.cookies);
    const {refreshToken}=req.cookies;
    if(!refreshToken){
        return  res.status(401).json({msg:"Not Authorized.."});
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    res.status(200).json({msg:"Logged Out Successfully"});

});


export default LogoutRoute;