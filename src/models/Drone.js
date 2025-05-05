const mongoose = require("mongoose");

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

module.exports = mongoose.model("Drone", droneSchema);
