const pool = require("../DB/db");

async function getAllMajors() {
  try {
    const result = await pool.query("SELECT * FROM majors");
    
    return result[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getAllMajors,
};