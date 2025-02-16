import mongoose from "mongoose";

const ChatSchema=new mongoose.Schema({
    participants: {
        type: [String], 
        required: true,
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



const Chat=mongoose.model("chat",ChatSchema);

export default Chat;