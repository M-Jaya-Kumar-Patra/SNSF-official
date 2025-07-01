import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addVisitCount, getVisitCount } from "../controllers/visitCount.controller.js";

const visitRouter = Router()

visitRouter.post('/new' , addVisitCount)   
visitRouter.post('/getVisit' , getVisitCount)   

export default visitRouter          