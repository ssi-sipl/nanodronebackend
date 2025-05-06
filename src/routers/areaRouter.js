import express from "express";
import {
  createArea,
  getAllAreas,
  getAreaById,
} from "../controllers/areaController.js";

const router = express.Router();

router.post("/create", createArea);
router.get("/", getAllAreas);
router.get("/area/:id", getAreaById);

export default router;
