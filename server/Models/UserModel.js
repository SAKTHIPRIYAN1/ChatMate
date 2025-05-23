import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import bcrypt from 'bcrypt';

import { generateAccessToken,generateRefreshToken } from "../Controllers/refreshTokController.js";
import { type } from "os";
const UserSchema=new Schema({
    name:{
        type: String,
        required: true,
        minlength: 1,  
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true, 
        trim: true, 

    },
    user_id:{
        type: String,
        required: true,
        // unique: true, 
        lowercase: true,  
        trim: true, 
    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
    profile:{
        type:String,
        trim:true
    }
    ,
    contacts:[{name:{type:String,trim:true,lowercase:true,}, profile:{type:String,trim:true},Auth:{type:String,trim:true,lowercase:true,},date:{type:Date},chatId:{type:mongoose.Schema.Types.ObjectId,trim:true}}],
    notifications:[{type:String,trim:true,lowercase:true,}],
},
{
timestamps:true,
});




UserSchema.statics.saveUser=async function (name,email,password,id) {
    console.log(name,email,password,id);
    const user=new this (
        {
            name,
            email,
            password,
            user_id:id
        }
    );

    try{
        console.log(user);
       const savedUser = await user.save();
       console.log(savedUser);
        const SignRefreshToken=generateRefreshToken({email,name,id});
        const SignAccessToken=generateAccessToken({email,name,id});
        return {SignAccessToken,SignRefreshToken};
    }
    catch(err){
        console.error(err);
        throw new Error("Error in inserting User to Db");
    }
};


// login function  
    // check the user entry..
    // fetch the password..
    // compare with bcrypt..
    // createtokens and return them....

UserSchema.statics.login=async function ({id,password}) {
    console.log({id,password});
    const user= await this.findOne({user_id:id});
    console.log(user);
    try{
        if(!user){
            throw new Error ("No Users found.");
        }

        const {email,user_id,name}=user;

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            console.log(password);
            throw new Error ("Password doesn't Match");
        }
        const data={email,id:user_id,name};
        const SignRefreshToken=generateRefreshToken({email,id:user_id,name});
        const SignAccessToken=generateAccessToken({email,id:user_id,name});
        return {SignAccessToken,SignRefreshToken,data};

    }
    catch(err){
        console.error(err.message);
        throw new Error (err.message);
    }
}

UserSchema.statics.mergeContact = async function (Auth, user_id) {
    const updatedUsers = await this.updateMany(
        { "contacts.Auth": Auth },
        { $set: { "contacts.$[elem].Auth": user_id } } , 
        { arrayFilters: [{ "elem.Auth": Auth }] } 
    );

    console.log(updatedUsers);
    return updatedUsers;
};


const User=mongoose.model("user",UserSchema);
export default User;
