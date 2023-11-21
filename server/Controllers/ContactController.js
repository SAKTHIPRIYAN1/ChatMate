import User from "../Models/UserModel.js";
import AnnonUser from "../Models/AnnonModel.js";
import Chat from '../Models/chatModel.js'
import Message from '../Models/messageModel.js';

const GetAllContact=async (req,res)=>{
    const {Auth}=req.params;
    console.log(Auth);
    try{
    let data=await User.findOne({user_id:Auth});
    // const {profile}=await User.findOne({user_id:data?.contacts?.id});
    if(!data){
        console.log("search in TempUserss");
        const {contacts}=await AnnonUser.findOne({user_id:Auth});

        // fetch their Profile Pic...
        return res.status(200).json({msg:"Data reterived SuccessFully.",data:contacts});
    }
    
    return res.status(200).json({msg:"Data reterived SuccessFully.",data:data.contacts});
    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }
};

export const BlockContact=async(req,res)=>{
    const {userAuth,RecipAuth}=req.body;
    console.log(userAuth,RecipAuth);
    try{
        let chat = await Chat.findOne({ participants: [userAuth, RecipAuth] });

        if (!chat) {
            chat = await Chat.findOne({ participants: [RecipAuth, userAuth] });
        }

        if (!chat) {
            throw new Error("Chat ID not found");
        }

        const _id = chat._id;

        // del teh Chat from the Id..
        await Chat.deleteOne({_id});

        // deleting the Messages with the Chat ID...
        await deleteMessages(_id);
        console.log("deleted!!!");


        // Remove the Recip From the User Contact...
       const userCon= await RemoveContact(userAuth,RecipAuth);
       const recipCon= await RemoveContact(RecipAuth,userAuth);
       console.log("removed!!");

        return res.status(200).json({
            msg: "Contact blocked successfully"
        });

    }
    catch(err){
        console.log(err.message);
        res.status(500).json({"msg":err.message});
    }
    
}


const RemoveContact=async(UserAuth,RecipAuth)=>{
    const user = await User.findOneAndUpdate(
        { user_id: UserAuth },
        { $pull: { contacts: { Auth: RecipAuth } } },
        { new: true }
    );

    if (!user) {
        throw new Error("User not found or contact removal failed");
    }

    return user.contacts;
}

const deleteMessages=async (chatId)=>{
    await Message.deleteMany({ chatId});
}


export const deleteMessageCon=async(req,res)=>{
    const {userAuth,RecipAuth}=req.body;
    try{
            let chat = await Chat.findOne({ participants: [userAuth, RecipAuth] });
    
            if (!chat) {
                chat = await Chat.findOne({ participants: [RecipAuth, userAuth] });
            }
    
            if (!chat) {
                throw new Error("Chat ID not found");
            }
    
            const _id = chat._id;
    
            // deleting the Messages with the Chat ID...
            await deleteMessages(_id);

            return res.status(200).json({
                msg: "Message Deleted successfully"
            });
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({"msg":err.message});
    }
}
export default GetAllContact;