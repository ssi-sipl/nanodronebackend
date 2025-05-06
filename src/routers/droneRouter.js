import express from "express";
import {
  createDrone,
  getAllDrones,
  sendDrone,
  dropPayload,
} from "../controllers/droneController.js";

const router = express.Router();

router.post("/create", createDrone);
router.get("/", getAllDrones);
router.post("/send", sendDrone);
router.post("/dropPayload", dropPayload);

export default router;
