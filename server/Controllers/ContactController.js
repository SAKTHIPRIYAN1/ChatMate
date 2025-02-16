import User from "../Models/UserModel.js";
import AnnonUser from "../Models/AnnonModel.js";

const GetAllContact=async (req,res)=>{
    const {Auth}=req.params;
    console.log(Auth);
    try{
    let data=await User.findOne({user_id:Auth});
    if(!data){
        console.log("search in TempUserss");
        const {contacts}=await AnnonUser.findOne({user_id:Auth});
        return res.status(200).json({msg:"Data reterived SuccessFully.",data:contacts});
    }
    return res.status(200).json({msg:"Data reterived SuccessFully.",data:data.contacts});
    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }
};

export default GetAllContact;