import Area from "../models/Area.js";
import Drone from "../models/Drone.js";
import mqttClient from "../mqttClient.js";

export async function createDrone(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Missing request body",
      });
    }
    const { name, drone_id } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message:
          'Invalid input: "name" is required and must be a non-empty string.',
      });
    }

    if (!drone_id || typeof drone_id !== "string" || drone_id.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "drone_id" is required and must be a non-empty string.',
      });
    }

    const existingDrone = await Drone.findOne({
      $or: [{ name }, { droneId: drone_id }],
    });
    if (existingDrone) {
      return res.status(409).json({
        status: false,
        message: "A drone with this name or drone_id already exists.",
      });
    }

    const drone = new Drone({ name, drone_id });
    await drone.save();

    res
      .status(201)
      .json({ status: true, message: "Drone added Successfully", data: drone });
  } catch (error) {
    console.log("Error at controllers/droneController/createDrone: ", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}

export async function getAllDrones(req, res) {
  try {
    const drones = await Drone.find();
    if (!drones || drones.length === 0) {
      return res.status(404).json({ status: true, message: "No drones found" });
    }
    res.status(200).json({
      status: true,
      message: "Drones Fetched Successfully",
      data: drones,
    });
  } catch (error) {
    console.log("Error at controllers/droneController/getAllDrones: ", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}

export async function sendDrone(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Missing request body",
      });
    }

    const { drone_id, area_id, latitude, longitude, altitude } = req.body;

    if (!drone_id || typeof drone_id !== "string" || drone_id.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "drone_id" is required and must be a non-empty string.',
      });
    }

    if (!latitude || !longitude || !altitude) {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "latitude", "longitude", and "altitude" are required.',
      });
    }

    const droneExists = await Drone.exists({ drone_id: drone_id });
    if (!droneExists) {
      return res.status(404).json({
        status: false,
        message: "Drone with the provided ID does not exist.",
      });
    }

    const areaExists = await Area.exists({ area_id: area_id });
    if (!areaExists) {
      return res.status(404).json({
        status: false,
        message: "Area with the provided ID does not exist.",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      typeof altitude !== "number"
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid input: latitude, longitude, and altitude must all be numbers.",
      });
    }

    const droneData = {
      drone_id,
      area_id,
      latitude,
      longitude,
      altitude,
      //   timestamp: new Date().toISOString(),
    };

    const topic = process.env.MQTT_BROKER_TOPIC;

    // Publish to MQTT
    mqttClient.publish(topic, JSON.stringify(droneData), (err) => {
      if (err) {
        console.error("MQTT Publish Error:", err);
        return res
          .status(500)
          .json({ status: false, message: "Failed to send data to drone." });
      }

      return res.status(200).json({
        status: true,
        message: "Drone data sent successfully",
        data: droneData,
      });
    });
  } catch (error) {
    console.error("Error at controllers/droneControllers/sendDrone:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}

export async function dropPayload(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Missing request body",
      });
    }

    const { drone_id, area_id } = req.body;

    if (!drone_id || typeof drone_id !== "string" || drone_id.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "drone_id" is required and must be a non-empty string.',
      });
    }

    if (!area_id || typeof area_id !== "string" || area_id.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "area_id" is required and must be a non-empty string.',
      });
    }

    const droneExists = await Drone.exists({ drone_id: drone_id });
    if (!droneExists) {
      return res.status(404).json({
        status: false,
        message: "Drone with the provided ID does not exist.",
      });
    }

    const areaExists = await Area.exists({ area_id: area_id });
    if (!areaExists) {
      return res.status(404).json({
        status: false,
        message: "Area with the provided ID does not exist.",
      });
    }

    const dropData = {
      drone_id,
      area_id,
    };

    const topic = process.env.MQTT_BROKER_TOPIC;

    mqttClient.publish(topic, JSON.stringify(dropData), (err) => {
      if (err) {
        console.error("MQTT Publish Error:", err);
        return res
          .status(500)
          .json({ status: false, message: "Failed to send command to drone." });
      }

      return res.status(200).json({
        status: true,
        message: "Drone drop command sent successfully.",
        data: dropData,
      });
    });
  } catch (error) {
    console.error("Error at controllers/droneControllers/dropPayload:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}
