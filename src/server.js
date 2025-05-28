import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import setupMqtt from "./mqttClient.js";
import http from "http";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("✅ Nano Drone Backend is running...");
});

setupMqtt(io); // Initialize MQTT client with Socket.IO

// Import routes (must be ES modules too)
import droneRouter from "./routers/droneRouter.js";
app.use("/drones", droneRouter);

import areaRouter from "./routers/areaRouter.js";
app.use("/areas", areaRouter);

// import protect from "./middleware/authMiddleware.js";
import sensorRouter from "./routers/sensorRouter.js";
// app.use("/sensors", protect, sensorRouter);
app.use("/sensors", sensorRouter);

import authRouter from "./routers/authRouter.js";

app.use("/auth", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on port ${PORT}`)
);
