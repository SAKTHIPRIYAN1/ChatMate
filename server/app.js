import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import socketSetup from "./socket.js";
import multer from "multer";

let app=express();
// db import...
import connectToDb from "./db.js";

// routes import..
import frt from './Routes/FileRoutes.js'
import SignUpRoutes from "./Routes/SignUpRoutes.js";
import { refreshTokenHandler } from "./Controllers/refreshTokController.js";

import loginRoute from "./Routes/loginRoute.js";
import requestRoute from "./Routes/requestRoute.js";
import rr from "./Routes/RequestActionsRoute.js";
import ContactRoute from "./Routes/ContactRoute.js";
import MessageRouter from "./Routes/MessageRoute.js";

import { changePasswordRequest,ConfirmPassword } from "./Controllers/LoginController.js";

import PreAuthRoute from "./SimpleRoutes.js";
import RandomRoute from "./Routes/RandomPassRoute.js";
// for refresh Token ......


// og routess..
const SignUpRoute=SignUpRoutes.SignUpRoute;
const fileRoute=frt.fileRoute;
const ReqActionRoute=rr.ReqActionRoute

const whitelist = ['http://localhost:5173'];

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());



// connecting databse with the backend...
connectToDb();

// Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get("/",(req,res)=>{
    return res.status(200).json({ msg: "ok" })
})


app.use((req, res, next) => {
  console.log('Request Path:', req.path);
  next();
});



// routers....
// connecting the routes with the router....
app.use('/request',ReqActionRoute);
app.post('/refresh-token',refreshTokenHandler);
app.use('/file',fileRoute);
app.use('/signUp',SignUpRoute);
app.use('/login',loginRoute);
app.use('/preauth',PreAuthRoute);
app.use('/saveUser',requestRoute);
app.use('/contact',ContactRoute);
app.use('/Message',MessageRouter);
app.use("/getRandomPass",RandomRoute);



// fileDownload route for messaing.........
app.get('/uploads/:filename', (req, res) => {
  const storedFilename = req.params.filename; // Get the stored filename
  const filePath = path.join(__dirname, 'uploads', storedFilename);

  // Get the custom filename from the query parameter (URL query)
  const customFilename = req.query.filename || storedFilename; // Default to stored filename if not specified

  // Log the file path for debugging
  console.log("File Path:", filePath);

  // Set headers to force file download with the custom filename
  res.setHeader('Content-Disposition', `attachment; filename="${customFilename}"`);
  res.setHeader('Content-Type', 'application/octet-stream'); // Generic binary file type

  // Send the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      return res.status(500).send('Error sending the file.');
    }
  });
});


app.post("/changePassword",changePasswordRequest);
app.post("/confirmPassword",ConfirmPassword);



let AppServer=app.listen(3000,()=>{
    console.log("app is litsening...")
});


// for socket connection...
socketSetup(AppServer);

