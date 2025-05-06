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
});

export default mongoose.model("Drone", droneSchema);
