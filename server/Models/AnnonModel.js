import mongoose from "mongoose";

const AnnonUserSchema=new mongoose.Schema({

        user_id:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,  
            trim: true, 
        },
        contacts:[{name:{type:String,trim:true,lowercase:true,},profile:{type:String,trim:true},Auth:{type:String,trim:true,lowercase:true,},date:{type:Date},chatId:{type:mongoose.Schema.Types.ObjectId,trim:true}}],
        notifications:[{type:String,trim:true,lowercase:true,}],
});

const AnnonUser=mongoose.model('TempUser',AnnonUserSchema);

export default AnnonUser;