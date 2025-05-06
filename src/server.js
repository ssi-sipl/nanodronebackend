import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import mqttClient from "./mqttClient.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Nano Drone Backend is running...");
});

// Import routes (must be ES modules too)
import droneRouter from "./routers/droneRouter.js";
app.use("/drones", droneRouter);

import areaRouter from "./routers/areaRouter.js";
app.use("/areas", areaRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
