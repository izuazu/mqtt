const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const { Server } = require("socket.io");

// Konfigurasi Express dan Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware untuk mengakses folder public
app.use(express.static("public"));

// Konfigurasi MQTT
const mqttBroker = "mqtt://broker.hivemq.com"; // Broker MQTT HiveMQ
const mqttClient = mqtt.connect(mqttBroker);

// MQTT: Berlangganan ke topik tertentu
const topic = "iot/topic";
mqttClient.on("connect", () => {
    console.log("Terhubung ke broker MQTT");
    mqttClient.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Berlangganan ke topik: ${topic}`);
        }
    });
});

// MQTT: Mendengarkan pesan dari broker
mqttClient.on("message", (topic, message) => {
    console.log(`Pesan diterima di topik ${topic}: ${message.toString()}`);
    // Kirim pesan ke frontend melalui Socket.IO
    io.emit("mqttMessage", { topic, message: message.toString() });
});

// Socket.IO: Terhubung dengan klien
io.on("connection", (socket) => {
    console.log("Klien terhubung");

    // Menerima data dari frontend untuk dikirim ke MQTT
    socket.on("publish", (data) => {
        const { topic, message } = data;
        mqttClient.publish(topic, message);
        console.log(`Pesan dipublikasikan ke topik ${topic}: ${message}`);
    });
});

// Jalankan server
const PORT = 8884;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
