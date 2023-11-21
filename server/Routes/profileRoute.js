import e from 'express';

import { Router } from 'express';
import changeNameController from '../Controllers/profileController.js';
import { changeProfilePic } from '../Controllers/profileController.js';

import multer from 'multer';
import path from 'path';
import User from '../Models/UserModel.js';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profilePic"); // Save images in this folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

// File Filter (Only Accept Images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpg","image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only image files (JPG, PNG, GIF, WEBP) are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter });


const profileRoute=e.Router();


profileRoute.post('/changeName',changeNameController);
profileRoute.post('/changeProfilePic',upload.single('file'),changeProfilePic);
profileRoute.post('/getPic',async(req,res)=>{
    if(!req.body)
        return res.status(500).json({msg:"No data"});
    const {user_id}=req.body;
    if(!user_id)
        return res.status(500).json({msg:"No User_id"});
    try{
        const user=await User.findOne({user_id});
        if(!user)
            return res.status(200);
        const {profile}=user;
        return res.status(200).json({profile});
    }
    catch(err){
        return res.status(500).json({msg:err?.message});
    }
})

export default profileRoute;