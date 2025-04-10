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
