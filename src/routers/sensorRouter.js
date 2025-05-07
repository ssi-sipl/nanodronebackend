import express from "express";
import {
  createSensor,
  getAllSensors,
} from "../controllers/sensorController.js";

const router = express.Router();

router.post("/create", createSensor);
router.get("/", getAllSensors);

export default router;
