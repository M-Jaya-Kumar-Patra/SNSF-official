// server/routes/productEvent.routes.js

import express from "express";
import { trackProductEvent, getProductEvents } from "../controllers/productEvent.controller.js";

const productEventRouter = express.Router();

// -----------------------------
// Track a product event (POST)
// -----------------------------
productEventRouter.post("/trackEvent", trackProductEvent);

// -----------------------------
// Get product events by visitor/session (GET)
// -----------------------------
productEventRouter.get("/events", getProductEvents);

export default productEventRouter;
