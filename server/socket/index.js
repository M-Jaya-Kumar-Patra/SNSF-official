import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import mongoose from "mongoose";
import AdminModel from "../models/admin.model.js";
import ConversationModel from "../models/conversation.model.js";

let ioInstance = null;

const roomName = (conversationId) => `conversation:${conversationId}`;

function getToken(socket) {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) return authToken.trim();
  const header = socket.handshake.headers?.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : "";
}

async function identifyToken(token) {
  if (!token) throw new Error("Socket authentication required");
  const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
  if (!mongoose.Types.ObjectId.isValid(decoded?._id)) throw new Error("Invalid socket identity");

  const admin = await AdminModel.findOne({ _id: decoded._id, status: "Active" }).select("_id").lean();
  return { userId: String(decoded._id), role: admin ? "ADMIN" : "USER" };
}

async function canAccessConversation(identity, conversationId) {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) return false;
  if (identity.role === "ADMIN") {
    return Boolean(await ConversationModel.exists({ _id: conversationId }));
  }
  return Boolean(await ConversationModel.exists({ _id: conversationId, userId: identity.userId }));
}

export function conversationRoom(conversationId) {
  return roomName(conversationId);
}

export function configureSocketIO(httpServer, { allowedOrigins = [] } = {}) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : true,
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  ioInstance.use(async (socket, next) => {
    try {
      socket.data.identity = await identifyToken(getToken(socket));
      return next();
    } catch (error) {
      return next(new Error(error.message || "Socket authentication failed"));
    }
  });

  ioInstance.on("connection", (socket) => {
    socket.data.conversationRooms = new Set();

    socket.on("join_conversation", async (conversationId, acknowledge) => {
      const ack = typeof acknowledge === "function" ? acknowledge : () => {};
      if (!(await canAccessConversation(socket.data.identity, conversationId))) {
        ack({ ok: false, message: "Unauthorized conversation" });
        return;
      }
      const room = roomName(conversationId);
      socket.join(room);
      socket.data.conversationRooms.add(String(conversationId));
      ack({ ok: true, conversationId: String(conversationId) });
    });

    socket.on("leave_conversation", (conversationId) => {
      const value = String(conversationId || "");
      socket.leave(roomName(value));
      socket.data.conversationRooms.delete(value);
    });

    socket.on("conversation_typing", ({ conversationId, isTyping } = {}) => {
      const value = String(conversationId || "");
      if (!socket.data.conversationRooms.has(value)) return;
      socket.to(roomName(value)).emit("conversation_typing", {
        conversationId: value,
        userId: socket.data.identity.userId,
        role: socket.data.identity.role,
        isTyping: Boolean(isTyping),
      });
    });

    socket.on("conversation_read", async ({ conversationId } = {}, acknowledge) => {
      const ack = typeof acknowledge === "function" ? acknowledge : () => {};
      const value = String(conversationId || "");
      if (!socket.data.conversationRooms.has(value)) {
        ack({ ok: false, message: "Join the conversation before marking it read" });
        return;
      }
      const field = socket.data.identity.role === "ADMIN" ? "unreadForAdmin" : "unreadForUser";
      await ConversationModel.updateOne({ _id: value }, { $set: { [field]: 0 } });
      ioInstance.to(roomName(value)).emit("conversation_read", {
        conversationId: value,
        role: socket.data.identity.role,
      });
      ack({ ok: true });
    });
  });

  return ioInstance;
}

export function getSocketIO() {
  return ioInstance;
}

export function emitConversationEvent(conversationId, event, payload) {
  if (!ioInstance || !conversationId) return;
  ioInstance.to(roomName(conversationId)).emit(event, {
    conversationId: String(conversationId),
    ...payload,
  });
}
