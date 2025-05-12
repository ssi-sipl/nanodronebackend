import mongoose from "mongoose";

const droneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  drone_id: {
    type: String,
    unique: true,
    required: true,
  },
  area_id: {
    type: String,
    required: true,
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
    required: true,
  },
});

export default mongoose.model("Drone", droneSchema);
