import mongoose from "mongoose";

const ChatSchema=new mongoose.Schema({
    participants: {
        type: [String], 
        required: true,
        lowercase:true,
        validate: {
          validator: function (value) {
            return value.length > 0;
          },
          message: "The participants array cannot be empty.",
        },
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
});

ChatSchema.statics.mergeChat = async function (Auth, user_id) {
  // Fetch all chat documents
  const chats = await this.find();


  const updatedChats = chats.map(chat => {
      for(let i=0;i<chat.participants.length;i++){
        if(chat.participants[i]==Auth){
          chat.participants[i]=user_id;
          return chat;
        }
      }
      return null;
  }).filter(chat => chat !== null); 

  // Save the modified chats back to the database
  for (let chat of updatedChats) {
      await chat.save();
  }

  console.log("Updated Chats:", updatedChats);
  return updatedChats;
};


const Chat=mongoose.model("chat",ChatSchema);

export default Chat;