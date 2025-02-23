import e from 'express';

import { Router } from 'express';
import changeNameController from '../Controllers/profileController.js';
import { changeProfilePic } from '../Controllers/profileController.js';

import multer from 'multer';
import path from 'path';


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

export default profileRoute;