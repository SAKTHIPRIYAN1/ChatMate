import mongoose from "mongoose";
import { Schema } from "mongoose";


const requestSchema=new Schema({
    sender:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    receiver:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    sendAuth:{
        type:String,
        required:true,
        trim:true,
    },
    recvAuth:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        required:true,
        lowercase:true,
        enum: ["pending", "accepted", "declined"], 
        default: "pending",
    },
    createdAt: { 
        type: Date, 
        default: Date.now ,
        expires: 60 * 60 * 24 *10 // for 10 days
    }, 
    annonymous:{
        type:[{
        type:String,
        }],
        required:true,
    }

});



const contactRequest=mongoose.model("request",requestSchema);

export default contactRequest;
