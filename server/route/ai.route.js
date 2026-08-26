import { Router } from "express";
import {
  chatWithAssistant,
  ingestAssistantKnowledge,
} from "../controllers/ai.controller.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import auth from "../middlewares/auth.js";

const aiRouter = Router();

aiRouter.post(
  "/chat",
  rateLimiter({
    windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60_000,
    max: Number(process.env.AI_RATE_LIMIT_MAX) || 30,
  }),
  chatWithAssistant,
);

aiRouter.post("/ingest", auth, ingestAssistantKnowledge);

export default aiRouter;
