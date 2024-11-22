import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';



import socketSetup from "./socket.js";
import multer from "multer";

let app=express();
// routes import..
import frt from './Routes/FileRoutes.js'


// og routess..
const fileRoute=frt.fileRoute;

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
};

app.use(cors(corsOptions));


// Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use it in your app
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get("/",(req,res)=>{
    return res.status(200).json({ msg: "ok" })
})


app.use('/file',fileRoute);


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




let AppServer=app.listen(3000,()=>{
    console.log("app is litsening...")
});

socketSetup(AppServer);

