import express from "express";
import { getRecommendedProducts } from "../controllers/recommendation.controller.js";

const recommendRouter = express.Router();

recommendRouter.get("/getRecommendations", getRecommendedProducts);

export default recommendRouter;
