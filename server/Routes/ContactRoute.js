import express from 'express';

import { Router } from 'express';

import GetAllContact,{BlockContact,deleteMessageCon} from '../Controllers/ContactController.js';
import contactRequest from '../Models/requestModel.js';
import User from '../Models/UserModel.js';
const ContactRoute=express.Router();

ContactRoute.get("/:Auth",GetAllContact);
ContactRoute.post('/block',BlockContact);
ContactRoute.post("/deleteMess",deleteMessageCon);
ContactRoute.post("/changeName", async (req, res) => {
    const { name, recvAuth, userAuth } = req.body;
  
    try {
      const result = await User.updateOne(
        { user_id: userAuth, "contacts.Auth": recvAuth }, 
        {
          $set: {
            "contacts.$.name": name, // 
          },
        }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: "Contact not found or name unchanged." });
      }
  
      return res.status(200).json({ msg: "Name updated successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });
  


export default ContactRoute;