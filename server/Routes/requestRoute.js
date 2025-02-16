import express from 'express';
import { Router } from 'express';

import requestController from '../Controllers/requestController.js';
import { GetAllRequest } from '../Controllers/requestController.js';

let requestRoute=express.Router();

requestRoute.post("/",requestController);
requestRoute.post("/getRequests",GetAllRequest);


export default requestRoute;