import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  area_id: {
    type: String,
    required: true,
  },
  sensor_id: {
    type: String,
    unique: true,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Sensor", sensorSchema);
