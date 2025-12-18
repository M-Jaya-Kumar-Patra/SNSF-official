import express from "express";
import { trackVisitor } from "../controllers/visitor.controller.js";

const visitorRouter = express.Router();

visitorRouter.post("/track", trackVisitor);

export default visitorRouter;
