import mqtt from "mqtt";

// Connect to the MQTT broker
// const client = mqtt.connect("mqtt://localhost:1883"); // Replace with your broker URL if different
const options = {
  username: "dro", // replace with your actual username
  password: "gxuvimr", // replace with your actual password
};

const client = mqtt.connect("mqtt://192.168.1.200:1883", options);
// Topic to subscribe to
const topic = "nanodrone";

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
  console.log(`Message received on topic: ${topic}`);
  console.log("Message:", message.toString());
});

client.on("error", (err) => {
  console.error("Error:", err);
});

export default client;
