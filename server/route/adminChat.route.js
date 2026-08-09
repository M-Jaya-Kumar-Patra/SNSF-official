import { Router } from "express";
import auth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";
import {
  closeConversation,
  getAdminConversationMessages,
  getAdminDesignRequest,
  listAdminConversations,
  listAdminDesignRequests,
  markAdminConversationRead,
  returnConversationToAI,
  sendAdminMessage,
  takeOverConversation,
  updateAdminDesignRequest,
} from "../controllers/adminChat.controller.js";

const adminChatRouter = Router();
adminChatRouter.use(auth, adminAuth);

adminChatRouter.get("/conversations", listAdminConversations);
adminChatRouter.get("/conversations/:id", getAdminConversationMessages);
adminChatRouter.post("/conversations/:id/messages", sendAdminMessage);
adminChatRouter.post("/conversations/:id/takeover", takeOverConversation);
adminChatRouter.post("/conversations/:id/return-to-ai", returnConversationToAI);
adminChatRouter.post("/conversations/:id/close", closeConversation);
adminChatRouter.post("/conversations/:id/read", markAdminConversationRead);
adminChatRouter.get("/design-requests", listAdminDesignRequests);
adminChatRouter.get("/design-requests/:id", getAdminDesignRequest);
adminChatRouter.patch("/design-requests/:id", updateAdminDesignRequest);

export default adminChatRouter;
