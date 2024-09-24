import express from "express";
import cors from 'cors';
let app=express();
import socketSetup from "./socket.js";



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

app.get("/",(req,res)=>{
    return res.status(200).json({ msg: "ok" })
})


let AppServer=app.listen(3000,()=>{
    console.log("app is litsening...")
});

socketSetup(AppServer);

