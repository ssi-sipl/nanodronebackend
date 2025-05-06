import express from "express";
import { createArea, getAllAreas } from "../controllers/areaController.js";

const router = express.Router();

router.post("/create", createArea);
router.get("/", getAllAreas);

export default router;
