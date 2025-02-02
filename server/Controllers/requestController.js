import contactRequest from "../Models/requestModel.js";
import { getIo } from "../socket.js";

import SaveRequestNotification from "./notifyUser.js";

const requestController=async (req,res)=>{
    console.log(req.body);
    const {sender,receiver,sendAuth,recvAuth,annonymous,recipSock}=req.body;
    console.log(recipSock);

    const newRequest=new contactRequest(
        {sender,receiver,sendAuth,recvAuth,annonymous}
    );

    // search if already there is a request......
    // try {
    //     const existingRequest = await contactRequest.findOne({
    //         $or: [
    //             { sendAuth, recvAuth },  
    //             { sendAuth: recvAuth, recvAuth: sendAuth } 
    //         ]
    //     });
    
    //     if (existingRequest) {
    //         console.log("Request already found...");
    //         return res.status(200).json({ msg: "Request already made." });
    //     }
    // } catch (err) {
    //     console.error(err.message);
    //     return res.status(500).json({ msg: err.message });
    // }


// notifying User for the Message...
    SaveRequestNotification(recipSock,sender,sendAuth);

// db entry......
    try{
        await newRequest.save();
        return res.status(200).json({msg:"Request Sent Successfully..."});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).json({msg:err.message});
    }
    
}

export default requestController;