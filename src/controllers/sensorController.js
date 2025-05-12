import mongoose from "mongoose";
import Area from "../models/Area.js";
import Sensor from "../models/Sensor.js"; // Adjust path as needed

// Create a new sensor
export const createSensor = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ status: false, message: "Request body is required." });
    }
    const { name, area_id, sensor_id, latitude, longitude } = req.body;

    // Basic validation
    if (
      !name ||
      !area_id ||
      !sensor_id ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res
        .status(400)
        .json({ message: "Latitude and longitude must be numbers." });
    }
    if (
      typeof name !== "string" ||
      typeof area_id !== "string" ||
      typeof sensor_id !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Name, area_id, and sensor_id must be strings." });
    }

    // Check if a sensor with the same area_id or sensor_id already exists
    const existingSensor = await Sensor.findOne({
      $or: [{ sensor_id }, { name }],
    });

    if (existingSensor) {
      return res.status(409).json({
        message:
          "Sensor with the same sensor_id or sensor_name already exists.",
      });
    }

    const existingArea = await Area.exists({ area_id });
    if (!existingArea) {
      return res.status(404).json({
        message: "Area with the provided area_id does not exist.",
      });
    }

    // Create and save the sensor
    const newSensor = new Sensor({
      name,
      area_id,
      sensor_id,
      latitude,
      longitude,
    });

    await newSensor.save();

    return res
      .status(201)
      .json({ message: "Sensor created successfully", sensor: newSensor });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    if (!sensors || sensors.length === 0) {
      return res
        .status(404)
        .json({ status: true, message: "No sensors found" });
    }

    res.status(200).json({
      status: true,
      message: "Sensors Fetched Successfully",
      data: sensors,
    });
  } catch (error) {
    console.log("Error at controllers/droneController/getAllAreas: ", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const updateSensor = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ status: false, message: "Request body is required." });
    }
    const { id } = req.params;
    const { name, area_id, sensor_id, latitude, longitude } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ID format.",
      });
    }
    // Validate input
    if (!sensor_id) {
      return res
        .status(400)
        .json({ staus: false, message: "Sensor ID is required." });
    }

    if (
      !name &&
      !area_id &&
      latitude === undefined &&
      longitude === undefined
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required to update the sensor.",
      });
    }

    // Find the sensor by ID
    const sensor = await Sensor.findById(id);

    if (!sensor) {
      return res
        .status(404)
        .json({ status: false, message: "Sensor not found." });
    }

    // Update the sensor fields
    if (name) sensor.name = name;
    if (area_id) sensor.area_id = area_id;
    if (latitude !== undefined) sensor.latitude = latitude;
    if (longitude !== undefined) sensor.longitude = longitude;

    // Save the updated sensor
    await sensor.save();

    return res.status(200).json({
      status: true,
      message: "Sensor updated successfully",
      sensor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ID format.",
      });
    }

    // Find and delete the sensor
    const deletedSensor = await Sensor.findByIdAndDelete(id);
    if (!deletedSensor) {
      return res
        .status(404)
        .json({ status: false, message: "Sensor not found." });
    }

    return res.status(200).json({
      status: true,
      message: "Sensor deleted successfully",
      sensor: deletedSensor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
