import mongoose from "mongoose";
import { model } from "mongoose";
import { type } from "os";

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Chat",
  },
  sender: {
    type: String,
    lowercase:true,
    required: true,
    ref: "User",
  },
  receiver: {
    type:String,
    lowercase:true,
    required: true,
    ref: "User",
  },


  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 2000,
  },

  isFile:{
    type:Boolean,
    default:false,
    required:true
  },
  fileName:{
    type:String,
    required:function(){return this.isFile}
  },
  filePath:{
    type:String,
    required:function(){return this.isFile}
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

MessageSchema.statics.SendMessage=async function (sender,receiver,chatId,message){
  const newMessage=new this(
    {
      sender,
      receiver,
      chatId,
      message,
    }
  )
  try{
    await newMessage.save();
  }
  catch(err){
    console.log(err);
    throw new Error("Error in inserting:"+err.message);
  }
};

MessageSchema.statics.SendFile=async function (sender,receiver,chatId,message,fileName,filePath) {
  const newMessage=new this(
    {
      sender,
      receiver,
      chatId,
      message,
      isFile:true,
      fileName,
      filePath
    }
  )
  try{
    await newMessage.save();
  }
  catch(err){
    console.log(err);
    throw new Error("Error in inserting:"+err.message);
  }
}

MessageSchema.statics.mergeMessage=async function  (Auth,user_id) {
    try{
      await this.updateMany({sender:Auth},{sender:user_id});
      await this.updateMany({receiver:Auth},{receiver:user_id});
    }
    catch(err){
      console.log(err);
      throw new Error("Error in Updating"+err.message);
    }
}

const Message = mongoose.model("Message", MessageSchema);

export default Message;