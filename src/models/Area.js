import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  area_id: {
    type: String,
    unique: true,
    required: true,
  },
  drones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drone",
    },
  ],
});

export default mongoose.model("Area", areaSchema);
