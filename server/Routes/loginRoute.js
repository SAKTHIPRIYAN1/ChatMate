import express from 'express';
import { Router } from 'express';
import LoginHandler from '../Controllers/LoginController.js';

const loginRoute=express.Router();
loginRoute.post("/",LoginHandler);

export default loginRoute;