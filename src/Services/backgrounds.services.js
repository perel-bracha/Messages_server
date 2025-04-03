const pool = require("../DB/db");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

const PORT = process.env.PORT || 8080;
const URL = process.env.URL || `https://messagesserver-production.up.railway.app`;
const getAllBackgrounds = async () => {
  try {
    const [backgrounds] = await pool.execute(`SELECT * FROM backgrounds`);

    return backgrounds.map((bg) => ({
      background_id: bg.background_id,
      background_name: bg.background_name,
      background_url: `${URL}${bg.background_path}`
    }));
  } catch (err) {
    console.error("❌ שגיאה בשליפת הרקעים:", err);
    throw new Error("שגיאה בשליפת הרקעים");
  }
};


async function createBackground(background) {
  try {
    const result = await pool.query(
      "INSERT INTO backgrounds (background_name) VALUES (?) RETURNING *",
      [background]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = { getAllBackgrounds };

// //gpt
// const multer = require("multer");
// const path = require("path");

// // הגדרת אחסון התמונות
// const storage = multer.diskStorage({
//   destination: "./uploads/messages/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // שם ייחודי
//   },
// });

// const upload = multer({ storage });

// // נתיב API להעלאת תמונה
// app.post("/upload", upload.single("image"), async (req, res) => {
//   const imagePath = `/uploads/messages/${req.file.filename}`;

//   // שמירת הנתיב במסד הנתונים
//   await pool.query("UPDATE messages SET image_path = ? WHERE message_id = ?", [
//     imagePath,
//     req.body.message_id,
//   ]);

//   res.json({ success: true, imagePath });
// });

// //gpt 2
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const pool = require("./dbConfig"); // חיבור למסד הנתונים

// const app = express();

// // הגדרת `multer` לניהול העלאת תמונות
// const storage = multer.diskStorage({
//   destination: "./uploads/backgrounds/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // שם קובץ ייחודי
//   },
// });

// const upload = multer({ storage });

// // נתיב API להעלאת תמונה
// app.post("/upload-background", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const imageName = req.file.originalname;
//   const imagePath = `/uploads/backgrounds/${req.file.filename}`;

//   try {
//     const [result] = await pool.query(
//       "INSERT INTO background_images (image_name, image_path) VALUES (?, ?)",
//       [imageName, imagePath]
//     );

//     res.json({ success: true, imageId: result.insertId, imagePath });
//   } catch (error) {
//     res.status(500).json({ error: "Database error", details: error });
//   }
// });



// //gpt client
// import { useState, useEffect } from "react";

// function BackgroundGallery() {
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/background-images")
//       .then((res) => res.json())
//       .then((data) => setImages(data));
//   }, []);

//   return (
//     <div>
//       {images.map((image) => (
//         <img key={image.image_id} src={`http://localhost:3000${image.image_path}`} alt={image.image_name} />
//       ))}
//     </div>
//   );
// }

// export default BackgroundGallery;
