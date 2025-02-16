import express from "express";
import { Router } from "express";

import multer from "multer";
import fileControllers from "../Controllers/fileControllers.js";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });

const upload = multer({ storage });
const fileRoute=express.Router();

// for uploading filesss in upload folder...
fileRoute.post("/Annon",upload.single('file'),fileControllers.FileRecv);
fileRoute.post("/Chat",upload.single('file'),fileControllers.ChatFileRecv);


export default {fileRoute};

