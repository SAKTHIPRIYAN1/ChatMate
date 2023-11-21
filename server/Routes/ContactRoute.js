import express from 'express';

import { Router } from 'express';

import GetAllContact,{BlockContact,deleteMessageCon} from '../Controllers/ContactController.js';
const ContactRoute=express.Router();

ContactRoute.get("/:Auth",GetAllContact);
ContactRoute.post('/block',BlockContact);
ContactRoute.post("/deleteMess",deleteMessageCon);


export default ContactRoute;