import Area from "../models/Area.js";
import mongoose from "mongoose";

export async function createArea(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Missing request body",
      });
    }

    const { name, area_id } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message:
          'Invalid input: "name" is required and must be a non-empty string.',
      });
    }

    if (!area_id || typeof area_id !== "string" || area_id.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "area_id" is required and must be a non-empty string.',
      });
    }

    const existingArea = await Area.findOne({
      $or: [{ name }, { areaId: area_id }],
    });
    if (existingArea) {
      return res.status(409).json({
        status: false,
        message: "A area with this name or area_id already exists.",
      });
    }

    const area = new Area({ name, area_id });
    await area.save();

    res
      .status(201)
      .json({ status: true, message: "Area added Successfully", data: area });
  } catch (error) {
    console.log("Error at controllers/areaController/createArea: ", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}

export async function getAllAreas(req, res) {
  try {
    const areas = await Area.find();
    if (!areas || areas.length === 0) {
      return res.status(404).json({ status: true, message: "No areas found" });
    }
    res.status(200).json({
      status: true,
      message: "Areas Fetched Successfully",
      data: areas,
    });
  } catch (error) {
    console.log("Error at controllers/areaController/getAllAreas: ", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}

export async function getAreaById(req, res) {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid area ID format.",
      });
    }

    // Fetch area and populate drones
    const area = await Area.findById(id).populate("drones");

    if (!area) {
      return res.status(404).json({
        status: false,
        message: "Area not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Area fetched successfully.",
      data: area,
    });
  } catch (error) {
    console.error("Error at controllers/areaController/getAreaById:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
}
