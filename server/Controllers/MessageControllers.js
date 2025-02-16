import Message from "../Models/messageModel.js";
import Chat from "../Models/chatModel.js";
import { getIo,getSocket } from "../socket.js";

const SendMessageController=async (req,res)=>{

    console.log("body",req.body);
    const {sender,receiver,chatId,message} =req.body;
    try{
        await Message.SendMessage(sender,receiver,chatId,message);
        const io=getIo();
        const recipSocket=getSocket(receiver);
        console.log('RecipSock:',recipSocket);
        io.to(recipSocket).emit("ChatMessage",{sender,receiver,chatId,message});
        res.status(200).json({msg:"heyyy"});
    }
    catch(err){
        console.log("cont: "+err);
        return res.status(500).json({msg:err.message});
    }
    
}




export const getAllMessages= async (req,res)=>{
    
    const {chatId}=req.params;
    console.log(chatId);

    if(!chatId){
        return res.status(200).json({msg:"heyyy",mess});
    }
    else{
    
    const mess=await Message.find({chatId:chatId});
    res.status(200).json({msg:"heyyy",mess});
    }

    
}

export default SendMessageController;