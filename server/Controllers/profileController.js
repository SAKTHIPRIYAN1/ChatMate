import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';
import { generateRefreshToken,generateAccessToken } from './refreshTokController.js';
import { hashPassword } from './SignUpControllers.js';



const changeNameController=async(req,res)=>{
    const {refreshToken}=req.cookies;
    if(!refreshToken){
        return res.status(401).json({msg:"Not Authorized."});
    }

    res.clearCookie('refreshToken',{
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })

    // verify the Jwt..
    const decodedData=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    console.log(decodedData);

    if(!decodedData){
        return res.status(401).json({msg:"Not Authorized."});
    }

    const {id}=decodedData;
    const {name}=req.body;
    decodedData["name"]=name;
    // change the updated name....
    const UpdatedUser=await User.updateOne({user_id:id},{name});
    if(!UpdatedUser){
        return res.status(401).json({msg:"No Users Found"});
    }

    const newrefreshToken=generateRefreshToken(decodedData);
    
    res.cookie('refreshToken',newrefreshToken,{
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000 *1000, // 10 days
        sameSite: 'none',
    });
    
    

    res.status(200).json({msg:"Name Updated Successfully",accessToken:generateAccessToken(decodedData)});

}

export const changeProfilePic=async(req,res)=>{
    const {refreshToken}=req.cookies;
    console.log(req.cookies)
    if(!refreshToken){
        return res.status(401).json({msg:"Not in Authorized."});
    }

    // verify the Jwt..
    const decodedData=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    console.log(decodedData);

    if(!decodedData){
        return res.status(401).json({msg:"Not Authorized."});
    }
    const {id}=decodedData;
    

    console.log('File uploaded:', req.file.filename);
    console.log(`/uploads/profilePic/${req.file.filename}`);
    
    await User.updateOne({user_id:id},{profile:req.file.filename});

    res.status(200).json({ filePath: `/uploads/profilePic/${req.file.filename}` });
}

export default changeNameController;