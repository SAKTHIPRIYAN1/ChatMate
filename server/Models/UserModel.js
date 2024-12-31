import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import 'dotenv/config'
const UserSchema=new Schema({
    name:{
        type: String,
        required: true,
        minlength: 2,  
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true, 
        lowercase: true,  
        trim: true, 

    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
},
{
timestamps:true,
});




UserSchema.statics.saveUser=async function (name,email,password) {
    const user=new this (
        {
            name,
            email,
            password
        }
    );

    try{
        await user.save();
        const SignUpToken=jwt.sign({email,name},process.env.AUTH_SECRET,{expiresIn:"60m"});
        return SignUpToken;
    }
    catch(err){
        console.error(err);
        throw new Error("Error in inserting User to Db");
    }
};


const User=mongoose.model("user",UserSchema);
export default User;
