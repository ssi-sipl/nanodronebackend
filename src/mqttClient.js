import dotenv from "dotenv";
import mqtt from "mqtt";

dotenv.config();

const {
  MQTT_BROKER_URL,
  MQTT_BROKER_PORT,
  MQTT_BROKER_USERNAME,
  MQTT_BROKER_PASSWORD,
  MQTT_BROKER_TOPIC,
} = process.env;

const options = {
  port: parseInt(MQTT_BROKER_PORT),
  username: MQTT_BROKER_USERNAME,
  password: MQTT_BROKER_PASSWORD,
};

const client = mqtt.connect(MQTT_BROKER_URL, options);

let io = null;

function setupMqtt(serverIO) {
  io = serverIO;

  client.on("connect", () => {
    console.log("✅ Connected to MQTT broker");
    client.subscribe(MQTT_BROKER_TOPIC, (err) => {
      if (err) {
        console.error("MQTT subscribe error:", err);
      } else {
        console.log(`📡 Subscribed to ${MQTT_BROKER_TOPIC}`);
      }
    });
  });

  client.on("message", (topic, message) => {
    try {
      const parsed = JSON.parse(message.toString());
      console.log("📥 Parsed data:", parsed);
      if (io) {
        io.emit("telemetry", parsed); // Emit structured data to frontend
      }
    } catch (err) {
      console.error("Invalid JSON message:", message.toString());
    }
  });
}

export default setupMqtt;
