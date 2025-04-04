require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }, // מאפשר חיבורים מכל מקום
});
app.use(cors());
app.use(express.json()); // מאפשר שליחת JSON בבקשות
app.use("/public/backgrounds", express.static("public/backgrounds"));
app.use("/public/images", express.static("public/images"));

app.use("/backgrounds", require("./src/API/backgrounds.routes"));
app.use("/majors", require("./src/API/majors.routes"));
app.use("/study_years", require("./src/API/study_years.routes"));
app.use("/messages", require("./src/API/messages.routes"));//(io)

io.on("connection", (socket) => {
  console.log(`לקוח מחובר ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`לקוח התנתק ${socket.id}`);
  });
});

app.get("", (req, res) => {
  return res.status(200).json("messages server");
});

app.use((req, res, next) => {
  res.status(404).json({ error: "הנתיב לא נמצא" });
});

// Middleware לטיפול בשגיאות כלליות
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "שגיאת שרת פנימית" });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.URL}`
  ); //http://localhost:${PORT}
});
