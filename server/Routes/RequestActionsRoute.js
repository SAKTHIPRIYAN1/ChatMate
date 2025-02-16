import express from 'express';

import { Router } from 'express';

import { RequestAcceptController,RequestDeclineController } from '../Controllers/requestController.js';
export const ReqActionRoute=express.Router();

ReqActionRoute.post("/accept",RequestAcceptController);
ReqActionRoute.post("/decline",RequestDeclineController);

export default {ReqActionRoute};