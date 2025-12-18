import { Router } from "express";
import {
  addVisitCount,
  getVisitCount,
  getVisitsByRange,
  getVisitsByCustomRange 
} from "../controllers/visitCount.controller.js";

const visitRouter = Router();

visitRouter.post("/new", addVisitCount);
visitRouter.get("/getVisit", getVisitCount);
visitRouter.get("/getByRange", getVisitsByRange);
visitRouter.get("/getCustomRange", getVisitsByCustomRange );


export default visitRouter;
