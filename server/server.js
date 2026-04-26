import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initSocket } from "./socket/index.js";

dotenv.config();

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL ||
  process.env.FRONTEND_URL ||
  process.env.CORS_ORIGIN ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Freelancer Platform API Running");
});

// Project routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/freelancer", freelancerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
