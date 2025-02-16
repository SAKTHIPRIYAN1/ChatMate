import express from 'express';
import { Router } from 'express';
import SendMessageController from '../Controllers/MessageControllers.js';
import { getAllMessages } from '../Controllers/MessageControllers.js';

const MessageRouter=express.Router();

MessageRouter.post("/sendMessage",SendMessageController);
MessageRouter.get("/getMessage/:chatId",getAllMessages)

export default MessageRouter;

