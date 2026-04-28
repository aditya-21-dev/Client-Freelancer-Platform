import { Server } from "socket.io";
import Message from "../models/Message.js";

const parseOrigins = () => {
  const rawOrigins =
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    "http://localhost:5173";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const initSocket = (server) => {
  const allowedOrigins = parseOrigins();

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (conversationId) => {
      if (!conversationId) return;

      socket.join(conversationId);
      console.log(`User ${socket.id} joined room ${conversationId}`);
    });

    socket.on("sendMessage", async (payload = {}) => {
      try {
        const { senderId, receiverId, conversationId, text, jobId, type } = payload;
        const normalizedConversationId =
          typeof conversationId === "string" ? conversationId.trim() : "";
        const normalizedText = typeof text === "string" ? text.trim() : "";

        if (
          !senderId ||
          !receiverId ||
          !normalizedConversationId ||
          !normalizedText
        ) {
          return socket.emit("messageError", {
            message:
              "senderId, receiverId, conversationId and text are required",
          });
        }

        const savedMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          conversationId: normalizedConversationId,
          text: normalizedText,
          jobId: jobId || null,
          type: type === "revision" ? "revision" : "normal",
        });

        io.to(normalizedConversationId).emit("receiveMessage", savedMessage);
      } catch (_error) {
        socket.emit("messageError", {
          message: "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
