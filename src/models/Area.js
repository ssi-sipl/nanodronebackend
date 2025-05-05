const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Area", areaSchema);
