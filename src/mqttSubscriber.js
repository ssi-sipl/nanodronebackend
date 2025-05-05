const mqtt = require("mqtt");

// Connect to the MQTT broker
const client = mqtt.connect("mqtt://localhost:1883"); // Replace with your broker URL if different

// Subscribe to the topic
const topic = "nanodrone"; // Replace with the topic you're using

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
});

client.on("message", (topic, message) => {
  // message is a Buffer, so we convert it to a string
  console.log(`Message received on topic: ${topic}`);
  console.log("Message:", message.toString());
});

client.on("error", (err) => {
  console.error("Error:", err);
});
