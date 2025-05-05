require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mqttClient = require("./mqttClient.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const itemRoutes = require("./routes/itemRoutes");
// app.use("/api/items", itemRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Nano Drone Backend is running...");
});

// Import routes
const droneRouter = require("./routers/droneRouter.js");
app.use("/drones", droneRouter);

const areaRouter = require("./routers/areaRouter.js");
app.use("/areas", areaRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
