import User from "../Models/UserModel.js";
import AnnonUser from "../Models/AnnonModel.js";
import Chat from "../Models/chatModel.js";
import Message from "../Models/messageModel.js";

const MergeController=async (Auth,user_id)=>{
    
    
    // This is to merge the Data of Annonymous after Login..
    // For Data integRating....
    // Merging the contat and Notification..
    if(!Auth)
            return;

        const tempContact=await AnnonUser.findOne({user_id:Auth});
        const tempUser=await AnnonUser.findOne({user_id:Auth});
        if(!tempUser){
            throw new Error("No User Found for Merging")
        }

        const {contacts,notifications}=tempUser;
        const updatedUser = await User.updateOne(
            { user_id: user_id },
            { 
                $push: { 
                    contacts: { $each: contacts }, 
                    notifications: { $each: notifications }
                }
            }
        );

        console.log(updatedUser);

        if(!updatedUser){
            throw new Error("No User UPdated");
        }

        
        await User.mergeContact(Auth,user_id);

        const deletedTemp= await AnnonUser.deleteOne({user_id:Auth});
        if(!deletedTemp){
            throw new Error("Internal Server Error");
        }

        // update from chat and Messages....
        try{
            await Message.mergeMessage(Auth,user_id);
            console.log("messsae Updated..");

            await Chat.mergeChat(Auth,user_id);
            console.log("Chaat is Updated,,,,,,,,,,");
        }
        catch(err){
            console.log(err);
        }
        console.log("Data Merged SuccessFully");


        
};

export default MergeController;