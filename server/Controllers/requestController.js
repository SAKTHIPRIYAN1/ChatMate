import contactRequest from "../Models/requestModel.js";
import { getIo } from "../socket.js";

import SaveRequestNotification from "./notifyUser.js";

import User from "../Models/UserModel.js";
import AnnonUser from "../Models/AnnonModel.js";
import Chat from "../Models/chatModel.js";

const requestController=async (req,res)=>{
    console.log(req.body);
    const {sender,receiver,sendAuth,recvAuth,annonymous,recipSock}=req.body;
    console.log(recipSock);

    
    const newRequest=new contactRequest(
        {sender,receiver,sendAuth,recvAuth,annonymous}
    );
    
    // search if already there is a request......
    try {
        const existingRequest = await contactRequest.findOne({
            $or: [
                { sendAuth, recvAuth },  
                { sendAuth: recvAuth, recvAuth: sendAuth } 
            ]
        });
    
        if (existingRequest) {
            console.log("Request already found...");
            return res.status(200).json({ msg: "Request already made." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: err.message });
    }


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


const separateByDate = (data,Auth) =>{
    const result = {
      today: [],
      thisMonth: [],
      earlier: [],
      
      };
  
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
    data.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      if (createdAt >= todayStart) {
        result.today.push(item);
      } else if (createdAt >= monthStart) {
        result.thisMonth.push(item);
      } else {
        result.earlier.push(item);
      }
    });

  
    
    return result;
  }
  


export const GetAllRequest= async (req,res)=>{
    const {Auth} = req.body;
    console.log(Auth);

    if(!Auth){
        return res.status(401).json({msg:"Not Authorized.."});
    }
    
    // Get all the requests 
    let requests=await contactRequest.find({$or:[{sendAuth:Auth},{recvAuth:Auth}]})
    .sort({createdAt:-1});
    console.log(requests)
    return res.status(200).json({msg:"Ok!!",data:separateByDate(requests,Auth)});

}

export const RequestAcceptController = async (req, res) => {
  
  // change the status of the user .......
    try {
      const { sendAuth, acceptor } = req.body; 
      console.log(req.body);
      const updatedRequest = await contactRequest.findOneAndUpdate(
        { sendAuth: sendAuth, recvAuth: acceptor }, 
        { status: "accepted" }, 
        { new: true } 
      );

      if (!updatedRequest) {
        console.log("internal Server Error...2");
        return res.status(404).json({ msg: "Request not found" });
      }
    
      // acceptor ==> receivour Auth.....
    //  fetching their name used to chatting annonymously...
    const {sender,receiver}=await contactRequest.findOne({sendAuth,recvAuth:acceptor});
    console.log(sender,receiver);

    // creating a Chat Id.....
    const newChat= new Chat({
      participants:[sendAuth,acceptor]
    }) ;

    console.log("chat Id created....")

    await newChat.save();
    // update the contacts of the User in the user columns....
     let User1= await User.updateOne({user_id:sendAuth}, { $push: { contacts: {name:receiver,Auth:acceptor,date:new Date(),chatId:newChat._id  }}});
     User1= await AnnonUser.updateOne({user_id:sendAuth}, { $push: { contacts: {name:receiver,Auth:acceptor,date:new Date(),chatId:newChat._id  }}});
     let User2= await User.updateOne({user_id:acceptor},{$push:{contacts: {name:sender,Auth:sendAuth,date:new Date,chatId:newChat._id }}});
     User2= await AnnonUser.updateOne({user_id:acceptor},{$push:{contacts: {name:sender,Auth:sendAuth,date:new Date,chatId:newChat._id }}});

     console.log("All Users are Updated....");

     if(!User1 || !User2){
      console.log("internal Server Error...");
      return res.status(401).json({msg:"Interal Server Error"});
     }
  
      res.status(200).json({ msg: "Request accepted", data: updatedRequest });
    } catch (err) {
      res.status(500).json({ msg: "Error accepting request", error: err.message });
    }
  };
  
  export const RequestDeclineController = async (req, res) => {

    try {
      const { sendAuth, acceptor } = req.body;
      console.log(req.body);
      const deletedRequest = await contactRequest.findOneAndDelete({
        sendAuth: sendAuth,
        recvAuth: acceptor,
      });
  
      if (!deletedRequest) {
        console.log("kkk");
        return res.status(404).json({ msg: "Request not found" });
      }
  
      return res.status(200).json({ msg: "Request declined and removed" });
    } catch (err) {
        console.log("heyyy");
      res.status(500).json({ msg: "Error declining request", error: err.message });
    }
  };
  

export default requestController;