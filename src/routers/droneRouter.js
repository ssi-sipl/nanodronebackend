import express from "express";
import {
  createDrone,
  getAllDrones,
  sendDrone,
  dropPayload,
  getAreaByDroneId,
} from "../controllers/droneController.js";

const router = express.Router();

router.post("/create", createDrone);
router.get("/", getAllDrones);
router.post("/send", sendDrone);
router.post("/dropPayload", dropPayload);
router.get("/drone/:drone_id", getAreaByDroneId);
export default router;
