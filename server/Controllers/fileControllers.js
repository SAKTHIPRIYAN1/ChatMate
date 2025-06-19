import express from "express"; 
import path from "path";
import { fileURLToPath } from 'url';
import Message from "../Models/messageModel.js";

const FileRecv=(req, res) => {
   
    console.log('File uploaded:', req.file.filename);
    res.json({ filePath: `/uploads/${req.file.filename}` });
};


const ChatFileRecv=async (req,res) =>{

    console.log('File uploaded:', req.file.filename);
    const {data}=req.body;
    const {sender,receiver,chatId,message} =JSON.parse(data);
    const {filename}=req.body;
    console.log(req.body);

    // Save in Db....
    try{
        await Message.SendFile(sender,receiver,chatId,message,filename,`/uploads/${req.file.filename}`)
        res.json({ filePath: `/uploads/${req.file.filename}` });
    }
    catch(err){
        res.status(500).json({msg:err.message});
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default {FileRecv,ChatFileRecv};
