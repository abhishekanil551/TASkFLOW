import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./infrastructure/database/db";
import authCheckRoutes from "./interfaces/routes/authCheckRoutes";
import authRoutes from "./interfaces/routes/authRoutes";
import taskRoutes from "./interfaces/routes/taskRoutes";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/auth", authCheckRoutes);
app.use("/api/tasks", taskRoutes);

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();
