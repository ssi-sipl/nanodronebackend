import dotenv from "dotenv";
import mqtt from "mqtt";

dotenv.config();

const {
  MQTT_BROKER_URL,
  MQTT_BROKER_PORT,
  MQTT_BROKER_USERNAME,
  MQTT_BROKER_PASSWORD,
} = process.env;

const options = {
  port: parseInt(MQTT_BROKER_PORT),
  username: MQTT_BROKER_USERNAME,
  password: MQTT_BROKER_PASSWORD,
};

const client = mqtt.connect(MQTT_BROKER_URL, options);

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
});

client.on("error", (err) => {
  console.error("❌ MQTT connection error:", err);
});

export default client;
