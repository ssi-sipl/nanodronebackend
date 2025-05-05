const express = require("express");
const { createArea, getAllAreas } = require("../controllers/areaController");

const router = express.Router();

router.post("/create", createArea);
router.get("/", getAllAreas);

module.exports = router;
