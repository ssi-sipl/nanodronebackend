const express = require("express");
const {
  createDrone,
  getAllDrones,
  getDroneById,
  sendDrone,
  dropPayload,
} = require("../controllers/droneController");

const router = express.Router();

router.post("/create", createDrone);
router.get("/", getAllDrones);
router.post("/send", sendDrone);
router.post("/dropPayload", dropPayload);

module.exports = router;
