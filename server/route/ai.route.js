import { Router } from "express";
import auth from "../middlewares/auth.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getConversationMessages,
  listConversations,
  markUserConversationRead,
  sendAssistantMessage,
} from "../controllers/ai.controller.js";
import {
  createKnowledge,
  deleteKnowledge,
  getKnowledge,
  indexKnowledge,
  listKnowledge,
  reindexKnowledge,
  updateKnowledge,
} from "../controllers/knowledge.controller.js";
import {
  createFurnitureDesign,
  editDesignImage,
  generateDesignImage,
  getFurnitureDesign,
  listFurnitureDesigns,
  listUserDesignRequests,
  submitDesignForApproval,
} from "../controllers/design.controller.js";

const aiRouter = Router();
const aiRateLimiter = rateLimiter({
  windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.AI_RATE_LIMIT_MAX) || 20,
});

aiRouter.use(aiRateLimiter);

aiRouter.get("/conversations", auth, listConversations);
aiRouter.get("/conversations/:id", auth, getConversationMessages);
aiRouter.post("/conversations/:id/read", auth, markUserConversationRead);
aiRouter.post("/chat", auth, sendAssistantMessage);

const imageRateLimiter = rateLimiter({
  windowMs: Number(process.env.AI_IMAGE_RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.AI_IMAGE_RATE_LIMIT_MAX) || 5,
  keyPrefix: "snsf:ai-image",
});

aiRouter.get("/designs", auth, listFurnitureDesigns);
aiRouter.post("/designs", auth, imageRateLimiter, createFurnitureDesign);
aiRouter.get("/designs/:id", auth, getFurnitureDesign);
aiRouter.post("/designs/:id/generate", auth, imageRateLimiter, generateDesignImage);
aiRouter.post("/designs/:id/edit", auth, imageRateLimiter, editDesignImage);
aiRouter.post("/designs/:id/request", auth, submitDesignForApproval);
aiRouter.get("/design-requests", auth, listUserDesignRequests);

aiRouter.get("/knowledge", auth, adminAuth, listKnowledge);
aiRouter.post("/knowledge", auth, adminAuth, createKnowledge);
aiRouter.post("/knowledge/reindex", auth, adminAuth, reindexKnowledge);
aiRouter.get("/knowledge/:id", auth, adminAuth, getKnowledge);
aiRouter.put("/knowledge/:id", auth, adminAuth, updateKnowledge);
aiRouter.delete("/knowledge/:id", auth, adminAuth, deleteKnowledge);
aiRouter.post("/knowledge/:id/index", auth, adminAuth, indexKnowledge);

export default aiRouter;
