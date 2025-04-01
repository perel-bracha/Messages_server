const pool = require("../DB/db");

async function getAllStudyYears() {
  try {
    const result = await pool.query("SELECT * FROM study_years");
    return result[0];
  } catch (err) {
    throw err;
  }
}
module.exports = {
  getAllStudyYears,
};