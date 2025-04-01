require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }, // מאפשר חיבורים מכל מקום
});
app.use(cors());
app.use(express.json()); // מאפשר שליחת JSON בבקשות
app.use("/backgrounds", express.static("public/backgrounds"));

app.use("/backgrounds", require("./src/API/backgrounds.routes"));
app.use("/majors", require("./src/API/majors.routes"));
app.use("/study_years", require("./src/API/study_years.routes"));
// app.use("/messages", require("./src/API/donations.routes"));//(io)

io.on("connection", (socket) => {
  console.log(`לקוח מחובר ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`לקוח התנתק ${socket.id}`);
  });
});
app.get("", (req, res) => {
  console.log("server is running");
  
  return res.status(200).json("messages server");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on messagesserver-production.up.railway.app`);//http://localhost:${PORT}
});
