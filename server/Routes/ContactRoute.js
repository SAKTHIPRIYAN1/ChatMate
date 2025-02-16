import express from 'express';

import { Router } from 'express';

import GetAllContact from '../Controllers/ContactController.js';
const ContactRoute=express.Router();

ContactRoute.get("/:Auth",GetAllContact);


export default ContactRoute;